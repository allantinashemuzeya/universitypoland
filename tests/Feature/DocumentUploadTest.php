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

class DocumentUploadTest extends TestCase
{
    use RefreshDatabase;

    protected $student;
    protected $application;

    protected function setUp(): void
    {
        parent::setUp();
        
        Storage::fake('private');
        
        // Create a student user
        $this->student = User::factory()->create([
            'role' => 'student',
            'email_verified_at' => now(),
        ]);
        
        // Create a program
        $program = Program::factory()->create();
        
        // Create an application for the student
        $this->application = Application::factory()->create([
            'user_id' => $this->student->id,
            'program_id' => $program->id,
            'status' => 'draft',
        ]);
    }

    /** @test */
    public function student_can_upload_document_to_their_application()
    {
        $this->actingAs($this->student);
        
        $file = UploadedFile::fake()->create('test-document.pdf', 1000, 'application/pdf');
        
        $response = $this->post(route('student.documents.store'), [
            'application_id' => $this->application->id,
            'type' => 'passport',
            'file' => $file,
            'description' => 'My passport copy',
        ]);
        
        $response->assertRedirect();
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('documents', [
            'application_id' => $this->application->id,
            'type' => 'passport',
            'file_name' => 'test-document.pdf',
            'description' => 'My passport copy',
            'verification_status' => 'pending',
        ]);
        
        $document = Document::where('application_id', $this->application->id)->first();
        Storage::disk('private')->assertExists($document->file_path);
    }

    /** @test */
    public function student_cannot_upload_document_to_another_students_application()
    {
        $otherStudent = User::factory()->create(['role' => 'student']);
        $otherApplication = Application::factory()->create([
            'user_id' => $otherStudent->id,
            'program_id' => $this->application->program_id,
        ]);
        
        $this->actingAs($this->student);
        
        $file = UploadedFile::fake()->create('test-document.pdf', 1000);
        
        $response = $this->post(route('student.documents.store'), [
            'application_id' => $otherApplication->id,
            'type' => 'passport',
            'file' => $file,
        ]);
        
        $response->assertStatus(404); // Because firstOrFail will throw 404
        $this->assertDatabaseCount('documents', 0);
    }

    /** @test */
    public function document_upload_validates_required_fields()
    {
        $this->actingAs($this->student);
        
        $response = $this->post(route('student.documents.store'), [
            // Missing all required fields
        ]);
        
        $response->assertSessionHasErrors(['application_id', 'type', 'file']);
    }

    /** @test */
    public function document_upload_validates_file_type()
    {
        $this->actingAs($this->student);
        
        $file = UploadedFile::fake()->create('test-document.exe', 1000);
        
        $response = $this->post(route('student.documents.store'), [
            'application_id' => $this->application->id,
            'type' => 'passport',
            'file' => $file,
        ]);
        
        $response->assertSessionHasErrors('file');
    }

    /** @test */
    public function document_upload_validates_file_size()
    {
        $this->actingAs($this->student);
        
        // Create a file larger than 5MB (5120KB)
        $file = UploadedFile::fake()->create('test-document.pdf', 15000);
        
        $response = $this->post(route('student.documents.store'), [
            'application_id' => $this->application->id,
            'type' => 'passport',
            'file' => $file,
        ]);
        
        $response->assertSessionHasErrors('file');
    }

    /** @test */
    public function document_upload_validates_document_type()
    {
        $this->actingAs($this->student);
        
        $file = UploadedFile::fake()->create('test-document.pdf', 1000);
        
        $response = $this->post(route('student.documents.store'), [
            'application_id' => $this->application->id,
            'type' => 'invalid_type',
            'file' => $file,
        ]);
        
        $response->assertSessionHasErrors('type');
    }

    /** @test */
    public function student_can_upload_multiple_documents_of_different_types()
    {
        $this->actingAs($this->student);
        
        $documentTypes = ['passport', 'transcript', 'diploma', 'language_certificate'];
        
        foreach ($documentTypes as $type) {
            $file = UploadedFile::fake()->create("$type.pdf", 1000);
            
            $response = $this->post(route('student.documents.store'), [
                'application_id' => $this->application->id,
                'type' => $type,
                'file' => $file,
            ]);
            
            $response->assertRedirect();
            $response->assertSessionHas('success');
        }
        
        $this->assertCount(4, $this->application->documents);
        
        foreach ($documentTypes as $type) {
            $this->assertDatabaseHas('documents', [
                'application_id' => $this->application->id,
                'type' => $type,
            ]);
        }
    }

    /** @test */
    public function student_can_view_their_uploaded_document()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'file_path' => 'documents/' . $this->application->id . '/test.pdf',
            'mime_type' => 'application/pdf',
        ]);
        
        // Create a simple PDF file (PDF header)
        $pdfContent = "%PDF-1.4\n%âÃÏÓ\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\nxref\n0 3\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\ntrailer\n<< /Size 3 /Root 1 0 R >>\nstartxref\n115\n%%EOF";
        Storage::disk('private')->put($document->file_path, $pdfContent);
        
        $this->actingAs($this->student);
        
        $response = $this->get(route('student.documents.show', $document));
        
        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    /** @test */
    public function student_cannot_view_another_students_document()
    {
        $otherStudent = User::factory()->create(['role' => 'student']);
        $otherApplication = Application::factory()->create(['user_id' => $otherStudent->id]);
        $otherDocument = Document::factory()->create([
            'application_id' => $otherApplication->id,
        ]);
        
        $this->actingAs($this->student);
        
        $response = $this->get(route('student.documents.show', $otherDocument));
        
        $response->assertForbidden();
    }

    /** @test */
    public function student_can_delete_document_from_draft_application()
    {
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'file_path' => 'documents/' . $this->application->id . '/test.pdf',
        ]);
        
        Storage::disk('private')->put($document->file_path, 'PDF content');
        
        $this->actingAs($this->student);
        
        $response = $this->delete(route('student.documents.destroy', $document));
        
        $response->assertRedirect();
        $response->assertSessionHas('success');
        
        $this->assertDatabaseMissing('documents', ['id' => $document->id]);
        Storage::disk('private')->assertMissing($document->file_path);
    }

    /** @test */
    public function student_cannot_delete_document_from_submitted_application()
    {
        $this->application->update(['status' => 'submitted']);
        
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
        ]);
        
        $this->actingAs($this->student);
        
        $response = $this->delete(route('student.documents.destroy', $document));
        
        $response->assertRedirect();
        $response->assertSessionHas('error', 'Cannot delete documents from submitted applications.');
        
        $this->assertDatabaseHas('documents', ['id' => $document->id]);
    }

    /** @test */
    public function student_cannot_delete_another_students_document()
    {
        $otherStudent = User::factory()->create(['role' => 'student']);
        $otherApplication = Application::factory()->create(['user_id' => $otherStudent->id]);
        $otherDocument = Document::factory()->create([
            'application_id' => $otherApplication->id,
        ]);
        
        $this->actingAs($this->student);
        
        $response = $this->delete(route('student.documents.destroy', $otherDocument));
        
        $response->assertForbidden();
        $this->assertDatabaseHas('documents', ['id' => $otherDocument->id]);
    }

    /** @test */
    public function document_stores_correct_metadata()
    {
        $this->actingAs($this->student);
        
        $file = UploadedFile::fake()->create('test-document.jpg', 2048, 'image/jpeg');
        
        $response = $this->post(route('student.documents.store'), [
            'application_id' => $this->application->id,
            'type' => 'passport',
            'file' => $file,
            'description' => 'Passport photo page',
        ]);
        
        $response->assertRedirect();
        
        $document = Document::where('application_id', $this->application->id)->first();
        
        $this->assertEquals('test-document.jpg', $document->file_name);
        $this->assertEquals(2048 * 1024, $document->file_size); // UploadedFile fake creates size in KB
        $this->assertEquals('image/jpeg', $document->mime_type);
        $this->assertEquals('Passport photo page', $document->description);
        $this->assertStringContainsString('documents/' . $this->application->id, $document->file_path);
    }

    /** @test */
    public function uploading_document_with_same_type_creates_new_record()
    {
        $this->actingAs($this->student);
        
        // Upload first passport
        $file1 = UploadedFile::fake()->create('passport1.pdf', 1000);
        $this->post(route('student.documents.store'), [
            'application_id' => $this->application->id,
            'type' => 'passport',
            'file' => $file1,
        ]);
        
        // Upload second passport (updated version)
        $file2 = UploadedFile::fake()->create('passport2.pdf', 1000);
        $response = $this->post(route('student.documents.store'), [
            'application_id' => $this->application->id,
            'type' => 'passport',
            'file' => $file2,
        ]);
        
        $response->assertRedirect();
        
        // Should have 2 passport documents
        $passportDocs = Document::where('application_id', $this->application->id)
            ->where('type', 'passport')
            ->get();
        
        $this->assertCount(2, $passportDocs);
    }

    /** @test */
    public function admin_can_download_student_document()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        
        $document = Document::factory()->create([
            'application_id' => $this->application->id,
            'file_path' => 'documents/' . $this->application->id . '/test.pdf',
            'file_name' => 'student-passport.pdf',
        ]);
        
        Storage::disk('private')->put($document->file_path, 'PDF content');
        
        $this->actingAs($admin);
        
        $response = $this->get(route('admin.documents.download', $document));
        
        $response->assertOk();
        $response->assertDownload('student-passport.pdf');
    }

    /** @test */
    public function document_upload_creates_proper_directory_structure()
    {
        $this->actingAs($this->student);
        
        $file = UploadedFile::fake()->create('test-document.pdf', 1000);
        
        $this->post(route('student.documents.store'), [
            'application_id' => $this->application->id,
            'type' => 'passport',
            'file' => $file,
        ]);
        
        $document = Document::first();
        
        // Check that the file is stored in the correct directory
        $this->assertStringStartsWith('documents/' . $this->application->id . '/', $document->file_path);
        Storage::disk('private')->assertExists($document->file_path);
    }
}
