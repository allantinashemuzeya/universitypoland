<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Document;
use App\Models\Program;
use App\Models\User;
use App\Notifications\DocumentUploaded;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminDocumentManagementTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $student;
    protected $application;

    protected function setUp(): void
    {
        parent::setUp();
        
        Storage::fake('private');
        Notification::fake();
        
        // Create admin and student users
        $this->admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        $this->student = User::factory()->create([
            'role' => 'student',
            'email_verified_at' => now(),
        ]);
        
        // Create a program and application
        $program = Program::factory()->create();
        $this->application = Application::factory()->create([
            'user_id' => $this->student->id,
            'program_id' => $program->id,
            'status' => 'submitted',
        ]);
    }

    /** @test */
    public function admin_can_view_pending_documents_page()
    {
        // Create some pending documents
        Document::factory()->count(3)->create([
            'application_id' => $this->application->id,
            'status' => 'pending',
        ]);
        
        // Create a verified document (should not appear in pending list)
        Document::factory()->create([
            'application_id' => $this->application->id,
            'status' => 'verified',
        ]);
        
        $this->actingAs($this->admin);
        
        $response = $this->get(route('admin.documents.pending'));
        
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Documents/Pending')
            ->has('documents.data', 3) // Only pending documents
        );
    }

    /** @test */
    public function admin_can_review_specific_document()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'status' => 'pending',
        ]);
        
        $this->actingAs($this->admin);
        
        $response = $this->get(route('admin.documents.review', $document));
        
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Documents/Review')
            ->has('document')
            ->where('document.id', $document->id)
        );
    }

    /** @test */
    public function admin_can_verify_document()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'status' => 'pending',
        ]);
        
        $this->actingAs($this->admin);
        
        $response = $this->post(route('admin.documents.updateStatus', $document), [
            'status' => 'verified',
            'review_notes' => 'Document looks authentic',
        ]);
        
        $response->assertRedirect();
        $response->assertSessionHas('success');
        
        $document->refresh();
        $this->assertEquals('verified', $document->status);
        $this->assertEquals($this->admin->id, $document->verified_by);
        $this->assertNotNull($document->verified_at);
        $this->assertNull($document->rejection_reason);
        
        // Check notification was sent
        Notification::assertSentTo(
            $this->student,
            DocumentUploaded::class
        );
    }

    /** @test */
    public function admin_can_reject_document_with_reason()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'status' => 'pending',
        ]);
        
        $this->actingAs($this->admin);
        
        $response = $this->post(route('admin.documents.updateStatus', $document), [
            'status' => 'rejected',
            'review_notes' => 'Document is not clear enough',
        ]);
        
        $response->assertRedirect();
        $response->assertSessionHas('success');
        
        $document->refresh();
        $this->assertEquals('rejected', $document->status);
        $this->assertEquals($this->admin->id, $document->verified_by);
        $this->assertNotNull($document->verified_at);
        $this->assertEquals('Document is not clear enough', $document->rejection_reason);
        
        // Check notification was sent
        Notification::assertSentTo(
            $this->student,
            DocumentUploaded::class
        );
    }

    /** @test */
    public function document_status_update_validates_status()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
        ]);
        
        $this->actingAs($this->admin);
        
        $response = $this->post(route('admin.documents.updateStatus', $document), [
            'status' => 'invalid_status',
        ]);
        
        $response->assertSessionHasErrors('status');
    }

    /** @test */
    public function admin_can_download_document()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'file_path' => 'documents/' . $this->application->id . '/test.pdf',
            'file_name' => 'student-document.pdf',
        ]);
        
        Storage::disk('private')->put($document->file_path, 'PDF content');
        
        $this->actingAs($this->admin);
        
        $response = $this->get(route('admin.documents.download', $document));
        
        $response->assertOk();
        $response->assertDownload('student-document.pdf');
    }

    /** @test */
    public function admin_can_view_document_in_browser()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'file_path' => 'documents/' . $this->application->id . '/test.pdf',
            'mime_type' => 'application/pdf',
        ]);
        
        // Create a simple PDF file (PDF header)
        $pdfContent = "%PDF-1.4\n%âÃÏÓ\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\nxref\n0 3\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\ntrailer\n<< /Size 3 /Root 1 0 R >>\nstartxref\n115\n%%EOF";
        Storage::disk('private')->put($document->file_path, $pdfContent);
        
        $this->actingAs($this->admin);
        
        $response = $this->get(route('admin.documents.view', $document));
        
        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    /** @test */
    public function admin_can_bulk_approve_documents()
    {
        $documents = Document::factory()->count(3)->create([
            'application_id' => $this->application->id,
            'status' => 'pending',
        ]);
        
        $this->actingAs($this->admin);
        
        $response = $this->post(route('admin.documents.bulkApprove'), [
            'document_ids' => $documents->pluck('id')->toArray(),
        ]);
        
        $response->assertRedirect();
        $response->assertSessionHas('success', '3 documents approved successfully.');
        
        foreach ($documents as $document) {
            $document->refresh();
            $this->assertEquals('verified', $document->status);
            $this->assertEquals($this->admin->id, $document->verified_by);
            $this->assertNotNull($document->verified_at);
        }
    }

    /** @test */
    public function admin_can_bulk_reject_documents()
    {
        $documents = Document::factory()->count(2)->create([
            'application_id' => $this->application->id,
            'status' => 'pending',
        ]);
        
        $this->actingAs($this->admin);
        
        $response = $this->post(route('admin.documents.bulkReject'), [
            'document_ids' => $documents->pluck('id')->toArray(),
            'review_notes' => 'Documents are not clear',
        ]);
        
        $response->assertRedirect();
        $response->assertSessionHas('success', '2 documents rejected.');
        
        foreach ($documents as $document) {
            $document->refresh();
            $this->assertEquals('rejected', $document->status);
            $this->assertEquals($this->admin->id, $document->verified_by);
            $this->assertNotNull($document->verified_at);
            $this->assertEquals('Documents are not clear', $document->rejection_reason);
        }
    }

    /** @test */
    public function bulk_operations_only_affect_pending_documents()
    {
        $pendingDoc = Document::factory()->create([
            'application_id' => $this->application->id,
            'status' => 'pending',
        ]);
        
        $verifiedDoc = Document::factory()->create([
            'application_id' => $this->application->id,
            'status' => 'verified',
        ]);
        
        $this->actingAs($this->admin);
        
        $response = $this->post(route('admin.documents.bulkApprove'), [
            'document_ids' => [$pendingDoc->id, $verifiedDoc->id],
        ]);
        
        $response->assertRedirect();
        
        $pendingDoc->refresh();
        $verifiedDoc->refresh();
        
        // Only pending document should be updated
        $this->assertEquals('verified', $pendingDoc->status);
        $this->assertEquals('verified', $verifiedDoc->status); // Should remain verified
        $this->assertNull($verifiedDoc->verified_by); // Should not be updated
    }

    /** @test */
    public function student_cannot_access_admin_document_routes()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
        ]);
        
        $this->actingAs($this->student);
        
        $response = $this->get(route('admin.documents.pending'));
        $response->assertRedirect(route('login'));
        
        $response = $this->get(route('admin.documents.review', $document));
        $response->assertRedirect(route('login'));
        
        $response = $this->post(route('admin.documents.updateStatus', $document), [
            'status' => 'verified',
        ]);
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function non_authenticated_user_cannot_access_document_routes()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
        ]);
        
        $response = $this->get(route('student.documents.show', $document));
        $response->assertRedirect(route('login'));
        
        $response = $this->post(route('student.documents.store'));
        $response->assertRedirect(route('login'));
        
        $response = $this->get(route('admin.documents.pending'));
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function document_review_includes_all_necessary_relationships()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'status' => 'pending',
        ]);
        
        $this->actingAs($this->admin);
        
        $response = $this->get(route('admin.documents.review', $document));
        
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Documents/Review')
            ->has('document.application.user')
            ->has('document.application.program')
        );
    }

    /** @test */
    public function rejected_document_can_be_re_uploaded_by_student()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'status' => 'rejected',
            'rejection_reason' => 'Document is blurry',
            'type' => 'passport',
        ]);
        
        $this->actingAs($this->student);
        
        // Student should be able to upload a new document of the same type
        $file = \Illuminate\Http\UploadedFile::fake()->create('new-passport.pdf', 1000);
        
        $response = $this->post(route('student.documents.store'), [
            'application_id' => $this->application->id,
            'type' => 'passport',
            'file' => $file,
            'description' => 'Re-uploaded clearer version',
        ]);
        
        $response->assertRedirect();
        $response->assertSessionHas('success');
        
        // Should have 2 passport documents now (old rejected + new pending)
        $this->assertCount(2, 
            Document::where('application_id', $this->application->id)
                    ->where('type', 'passport')
                    ->get()
        );
    }
}
