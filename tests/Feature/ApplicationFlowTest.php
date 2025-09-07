<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Document;
use App\Models\Program;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ApplicationFlowTest extends TestCase
{
    use RefreshDatabase;

    protected $student;
    protected $admin;
    protected $program;

    protected function setUp(): void
    {
        parent::setUp();
        
        Storage::fake('private');
        
        // Create users
        $this->student = User::factory()->create([
            'name' => 'Test Student',
            'email' => 'student@test.com',
            'role' => 'student',
            'email_verified_at' => now(),
        ]);
        
        $this->admin = User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        // Create a program
        $this->program = Program::factory()->create([
            'name' => 'Test Program',
            'code' => 'TEST001',
            'is_active' => true,
        ]);
    }

    /** @test */
    public function complete_application_flow_works_end_to_end()
    {
        // Step 1: Student logs in
        $response = $this->post('/login', [
            'email' => $this->student->email,
            'password' => 'password',
        ]);
        $response->assertRedirect('/dashboard');
        
        // Step 2: Student views dashboard
        $response = $this->actingAs($this->student)->get('/student/dashboard');
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Dashboard')
            ->has('applications', 0)
        );
        
        // Step 3: Student creates a new application
        $response = $this->get(route('student.applications.create'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Applications/Create')
            ->has('programs', 1)
        );
        
        // Step 4: Student submits application form
        $applicationData = [
            'program_id' => $this->program->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'date_of_birth' => '2000-01-01',
            'nationality' => 'Test Country',
            'passport_number' => 'TEST123456',
            'email' => 'john.doe@test.com',
            'phone' => '+1234567890',
            'address' => '123 Test Street',
            'city' => 'Test City',
            'country' => 'Test Country',
            'postal_code' => '12345',
            'education_level' => 'Bachelor\'s Degree',
            'institution_name' => 'Test University',
            'graduation_year' => 2022,
            'gpa' => 3.75,
            'english_proficiency' => 'IELTS',
            'english_test_score' => '7.5',
            'motivation_letter' => str_repeat('This is my motivation letter. ', 20),
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '+0987654321',
            'emergency_contact_relationship' => 'Mother',
        ];
        
        $response = $this->post(route('student.applications.store'), $applicationData);
        $response->assertRedirect();
        
        $application = Application::where('user_id', $this->student->id)->first();
        $this->assertNotNull($application);
        $this->assertEquals('draft', $application->status);
        
        // Step 5: Student views the application
        $response = $this->get(route('student.applications.show', $application));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Applications/Show')
            ->has('application')
            ->where('application.status', 'draft')
        );
        
        // Step 6: Student uploads documents
        $documents = [
            ['type' => 'passport', 'file' => UploadedFile::fake()->create('passport.pdf', 1000)],
            ['type' => 'transcript', 'file' => UploadedFile::fake()->create('transcript.pdf', 2000)],
            ['type' => 'diploma', 'file' => UploadedFile::fake()->create('diploma.pdf', 1500)],
        ];
        
        foreach ($documents as $doc) {
            $response = $this->post(route('student.documents.store'), [
                'application_id' => $application->id,
                'type' => $doc['type'],
                'file' => $doc['file'],
                'description' => 'Test document',
            ]);
            $response->assertRedirect();
        }
        
        $this->assertCount(3, $application->fresh()->documents);
        
        // Step 7: Student submits the application
        $response = $this->post(route('student.applications.submit', $application));
        $response->assertRedirect();
        
        $application->refresh();
        $this->assertEquals('submitted', $application->status);
        $this->assertNotNull($application->submission_date);
        
        // Step 8: Admin logs in and views applications
        $this->actingAs($this->admin);
        
        $response = $this->get(route('admin.applications.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Applications/Index')
            ->has('applications.data', 1)
        );
        
        // Step 9: Admin views the specific application
        $response = $this->get(route('admin.applications.show', $application));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Applications/Show')
            ->has('application')
            ->where('application.id', $application->id)
        );
        
        // Step 10: Admin reviews and approves documents
        foreach ($application->documents as $document) {
            $response = $this->post(route('admin.documents.updateStatus', $document), [
                'status' => 'verified',
                'review_notes' => 'Document verified',
            ]);
            $response->assertRedirect();
        }
        
        // Step 11: Admin accepts the application
        $response = $this->post(route('admin.applications.updateStatus', $application), [
            'status' => 'accepted',
            'notes' => 'Congratulations! Your application has been accepted.',
        ]);
        $response->assertRedirect();
        
        $application->refresh();
        $this->assertEquals('accepted', $application->status);
        $this->assertDatabaseHas('application_status_histories', [
            'application_id' => $application->id,
            'from_status' => 'submitted',
            'to_status' => 'accepted',
            'changed_by' => $this->admin->id,
        ]);
        
        // Step 12: Student views updated application status
        $this->actingAs($this->student);
        
        $response = $this->get(route('student.applications.show', $application));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Applications/Show')
            ->where('application.status', 'accepted')
            ->has('application.status_histories', 2) // submitted and accepted
        );
    }

    /** @test */
    public function document_upload_and_review_flow_works()
    {
        Storage::fake('private');
        
        // Create an application
        $application = Application::factory()->create([
            'user_id' => $this->student->id,
            'program_id' => $this->program->id,
            'status' => 'draft',
        ]);
        
        // Student uploads a document
        $this->actingAs($this->student);
        
        $file = UploadedFile::fake()->create('test-document.pdf', 500);
        
        $response = $this->post(route('student.documents.store'), [
            'application_id' => $application->id,
            'type' => 'passport',
            'file' => $file,
            'description' => 'My passport',
        ]);
        
        $response->assertRedirect();
        $response->assertSessionHas('success');
        
        $document = Document::where('application_id', $application->id)->first();
        $this->assertNotNull($document);
        $this->assertEquals('pending', $document->status);
        $this->assertEquals('passport', $document->type);
        
        Storage::disk('private')->assertExists($document->file_path);
        
        // Admin reviews the document
        $this->actingAs($this->admin);
        
        $response = $this->get(route('admin.documents.pending'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Documents/Pending')
            ->has('documents.data', 1)
        );
        
        // Admin approves the document
        $response = $this->post(route('admin.documents.updateStatus', $document), [
            'status' => 'verified',
            'review_notes' => 'Document looks good',
        ]);
        
        $response->assertRedirect();
        
        $document->refresh();
        $this->assertEquals('verified', $document->status);
        $this->assertEquals($this->admin->id, $document->verified_by);
        $this->assertNotNull($document->verified_at);
    }

    /** @test */
    public function communication_flow_works()
    {
        $application = Application::factory()->submitted()->create([
            'user_id' => $this->student->id,
            'program_id' => $this->program->id,
        ]);
        
        // Admin sends a message to student
        $this->actingAs($this->admin);
        
        $communicationData = [
            'application_id' => $application->id,
            'sender_id' => $this->admin->id,
            'recipient_id' => $this->student->id,
            'subject' => 'Additional Documents Required',
            'message' => 'Please upload your language certificate.',
            'type' => 'internal_message',
        ];
        
        \App\Models\Communication::create($communicationData);
        
        // Student views the communication
        $this->actingAs($this->student);
        
        $communication = \App\Models\Communication::first();
        
        $response = $this->get(route('student.communications.show', $communication));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Communications/Show')
            ->has('communication')
            ->where('communication.subject', 'Additional Documents Required')
        );
        
        // Verify the communication is marked as read
        $communication->refresh();
        $this->assertNotNull($communication->read_at);
        $this->assertTrue($communication->is_read);
        
        // Student replies to the communication
        $response = $this->post(route('student.communications.reply', $communication), [
            'message' => 'I will upload the language certificate shortly.',
        ]);
        
        $response->assertRedirect();
        
        // Verify reply was created
        $reply = \App\Models\Communication::where('parent_id', $communication->id)->first();
        $this->assertNotNull($reply);
        $this->assertEquals($this->student->id, $reply->sender_id);
        $this->assertEquals($this->admin->id, $reply->recipient_id);
    }
}
