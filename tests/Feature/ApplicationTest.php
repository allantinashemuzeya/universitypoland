<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Program;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    protected $student;
    protected $program;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a student user
        $this->student = User::factory()->create([
            'role' => 'student',
            'email_verified_at' => now(),
        ]);
        
        // Create a program
        $this->program = Program::create([
            'name' => 'Test Program',
            'code' => 'TEST001',
            'description' => 'Test description',
            'degree_type' => 'bachelor',
            'duration_years' => 3,
            'faculty' => 'Test Faculty',
            'tuition_fee' => 5000,
            'application_fee' => 100,
            'requirements' => 'Test requirements',
            'application_deadline' => now()->addMonths(3),
            'start_date' => now()->addMonths(6),
            'is_active' => true,
            'max_students' => 100,
        ]);
    }

    /** @test */
    public function student_can_create_draft_application()
    {
        $applicationData = [
            'program_id' => $this->program->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'date_of_birth' => '2000-01-01',
            'nationality' => 'Zimbabwean',
            'passport_number' => 'ZW123456',
            'email' => 'john.doe@example.com',
            'phone' => '+263712345678',
            'address' => '123 Test Street',
            'city' => 'Harare',
            'country' => 'Zimbabwe',
            'postal_code' => '00263',
            'education_level' => 'High School',
            'institution_name' => 'Test High School',
            'graduation_year' => 2023,
            'gpa' => 3.5,
            'english_proficiency' => 'IELTS',
            'english_test_score' => '7.5',
            'motivation_letter' => 'This is my motivation letter with more than 200 characters. I am very interested in this program because it will help me achieve my career goals and contribute to my community development in the future.',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '+263712345679',
            'emergency_contact_relationship' => 'Mother',
        ];

        $response = $this->actingAs($this->student)
            ->post(route('student.applications.store'), $applicationData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('applications', [
            'user_id' => $this->student->id,
            'program_id' => $this->program->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'status' => 'draft',
            'submission_date' => null,
        ]);
    }

    /** @test */
    public function student_can_update_draft_application()
    {
        $application = Application::factory()->create([
            'user_id' => $this->student->id,
            'program_id' => $this->program->id,
            'status' => 'draft',
        ]);

        $updatedData = [
            'program_id' => $this->program->id,
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'date_of_birth' => '2000-01-01',
            'nationality' => 'Zimbabwean',
            'passport_number' => 'ZW123456',
            'email' => 'updated@example.com',
            'phone' => '+263712345678',
            'address' => '123 Updated Street',
            'city' => 'Harare',
            'country' => 'Zimbabwe',
            'postal_code' => '00263',
            'education_level' => 'High School',
            'institution_name' => 'Updated High School',
            'graduation_year' => 2023,
            'gpa' => 3.8,
            'english_proficiency' => 'IELTS',
            'english_test_score' => '8.0',
            'motivation_letter' => 'This is my updated motivation letter with more than 200 characters. I am very interested in this program because it will help me achieve my career goals and contribute to my community development in the future.',
            'emergency_contact_name' => 'Jane Updated',
            'emergency_contact_phone' => '+263712345679',
            'emergency_contact_relationship' => 'Mother',
        ];

        $response = $this->actingAs($this->student)
            ->put(route('student.applications.update', $application), $updatedData);

        $response->assertRedirect(route('student.applications.show', $application));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('applications', [
            'id' => $application->id,
            'first_name' => 'Updated',
            'last_name' => 'Name',
        ]);
    }

    /** @test */
    public function student_cannot_edit_submitted_application()
    {
        $application = Application::factory()->create([
            'user_id' => $this->student->id,
            'program_id' => $this->program->id,
            'status' => 'submitted',
            'submission_date' => now(),
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('student.applications.edit', $application));

        $response->assertRedirect(route('student.applications.show', $application));
        $response->assertSessionHas('error');
    }

    /** @test */
    public function validation_fails_with_missing_required_fields()
    {
        $response = $this->actingAs($this->student)
            ->post(route('student.applications.store'), []);

        $response->assertSessionHasErrors([
            'program_id',
            'first_name',
            'last_name',
            'date_of_birth',
            'nationality',
            'passport_number',
            'email',
            'phone',
            'address',
            'city',
            'country',
            'postal_code',
            'education_level',
            'institution_name',
            'graduation_year',
            'english_proficiency',
            'motivation_letter',
            'emergency_contact_name',
            'emergency_contact_phone',
            'emergency_contact_relationship',
        ]);
    }

    /** @test */
    public function motivation_letter_must_be_at_least_200_characters()
    {
        $applicationData = [
            'program_id' => $this->program->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'date_of_birth' => '2000-01-01',
            'nationality' => 'Zimbabwean',
            'passport_number' => 'ZW123456',
            'email' => 'john.doe@example.com',
            'phone' => '+263712345678',
            'address' => '123 Test Street',
            'city' => 'Harare',
            'country' => 'Zimbabwe',
            'postal_code' => '00263',
            'education_level' => 'High School',
            'institution_name' => 'Test High School',
            'graduation_year' => 2023,
            'gpa' => 3.5,
            'english_proficiency' => 'IELTS',
            'english_test_score' => '7.5',
            'motivation_letter' => 'Too short', // Less than 200 characters
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '+263712345679',
            'emergency_contact_relationship' => 'Mother',
        ];

        $response = $this->actingAs($this->student)
            ->post(route('student.applications.store'), $applicationData);

        $response->assertSessionHasErrors(['motivation_letter']);
    }

    /** @test */
    public function application_generates_unique_application_number()
    {
        $application1 = Application::factory()->create([
            'user_id' => $this->student->id,
            'program_id' => $this->program->id,
        ]);

        $application2 = Application::factory()->create([
            'user_id' => $this->student->id,
            'program_id' => $this->program->id,
        ]);

        $this->assertNotEquals($application1->application_number, $application2->application_number);
        $this->assertStringStartsWith('APP-' . date('Y'), $application1->application_number);
        $this->assertStringStartsWith('APP-' . date('Y'), $application2->application_number);
    }
}
