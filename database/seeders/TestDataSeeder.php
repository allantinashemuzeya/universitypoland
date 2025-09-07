<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Communication;
use App\Models\Document;
use App\Models\Program;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test students
        $student1 = User::create([
            'name' => 'John Mukamuri',
            'email' => 'john.mukamuri@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        $student2 = User::create([
            'name' => 'Sarah Chigumba',
            'email' => 'sarah.chigumba@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        // Get programs
        $programs = Program::all();

        // Create draft application for John
        $johnDraftApp = Application::factory()->create([
            'user_id' => $student1->id,
            'program_id' => $programs->first()->id,
            'status' => 'draft',
            'first_name' => 'John',
            'last_name' => 'Mukamuri',
            'email' => $student1->email,
        ]);

        // Create submitted application for Sarah
        $sarahSubmittedApp = Application::factory()->submitted()->create([
            'user_id' => $student2->id,
            'program_id' => $programs->skip(1)->first()->id,
            'first_name' => 'Sarah',
            'last_name' => 'Chigumba',
            'email' => $student2->email,
        ]);

        // Get admin user for verifying documents and sending communications
        $admin = User::where('role', 'admin')->first();

        // Add some documents for Sarah's application
        Document::create([
            'application_id' => $sarahSubmittedApp->id,
            'type' => 'passport',
            'file_name' => 'passport.pdf',
            'file_path' => 'documents/' . $sarahSubmittedApp->id . '/passport.pdf',
            'file_size' => '1024000',
            'mime_type' => 'application/pdf',
            'status' => 'verified',
            'verified_at' => now(),
            'verified_by' => $admin->id,
        ]);

        Document::create([
            'application_id' => $sarahSubmittedApp->id,
            'type' => 'transcript',
            'file_name' => 'transcript.pdf',
            'file_path' => 'documents/' . $sarahSubmittedApp->id . '/transcript.pdf',
            'file_size' => '2048000',
            'mime_type' => 'application/pdf',
            'status' => 'pending',
        ]);

        Document::create([
            'application_id' => $sarahSubmittedApp->id,
            'type' => 'diploma',
            'file_name' => 'diploma.pdf',
            'file_path' => 'documents/' . $sarahSubmittedApp->id . '/diploma.pdf',
            'file_size' => '1536000',
            'mime_type' => 'application/pdf',
            'status' => 'pending',
        ]);

        // Add a communication from admin to Sarah
        Communication::create([
            'application_id' => $sarahSubmittedApp->id,
            'sender_id' => $admin->id,
            'recipient_id' => $student2->id,
            'subject' => 'Application Received',
            'message' => "Dear Sarah,\n\nThank you for submitting your application to our Master of Business Administration program. We have received your application and it is currently under review.\n\nPlease ensure all required documents are uploaded. We will contact you if we need any additional information.\n\nBest regards,\nAdmissions Office",
            'type' => 'internal_message',
        ]);

        // Create a few more random applications
        User::factory(5)->state(['role' => 'student'])->create()->each(function ($student) use ($programs) {
            Application::factory()
                ->count(rand(1, 2))
                ->for($student)
                ->for($programs->random())
                ->create();
        });

        $this->command->info('Test data seeded successfully!');
        $this->command->info('Test accounts:');
        $this->command->info('Student 1: john.mukamuri@example.com / password');
        $this->command->info('Student 2: sarah.chigumba@example.com / password');
        $this->command->info('Admin: admin@uitm.pl / password');
    }
}
