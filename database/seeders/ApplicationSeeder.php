<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Program;
use App\Models\Application;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample students from Zimbabwe
        $student1 = User::create([
            'name' => 'John Mukamuri',
            'email' => 'john.mukamuri@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'phone' => '+263771234567',
            'country' => 'Zimbabwe',
            'date_of_birth' => '2002-05-15',
            'email_verified_at' => now(),
        ]);

        $student2 = User::create([
            'name' => 'Sarah Chigumba',
            'email' => 'sarah.chigumba@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'phone' => '+263779876543',
            'country' => 'Zimbabwe',
            'date_of_birth' => '2001-08-22',
            'email_verified_at' => now(),
        ]);

        // Create sample students from Asia
        $student3 = User::create([
            'name' => 'Wei Chen',
            'email' => 'wei.chen@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'phone' => '+8613812345678',
            'country' => 'China',
            'date_of_birth' => '2000-11-10',
            'email_verified_at' => now(),
        ]);

        $student4 = User::create([
            'name' => 'Priya Sharma',
            'email' => 'priya.sharma@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'phone' => '+919876543210',
            'country' => 'India',
            'date_of_birth' => '2001-03-25',
            'email_verified_at' => now(),
        ]);

        // Get programs
        $bscs = Program::where('name', 'Bachelor of Computer Science')->first();
        $mba = Program::where('name', 'Master of Business Administration (MBA)')->first();
        $bir = Program::where('name', 'Bachelor of International Relations')->first();

        // Create applications
        Application::create([
            'user_id' => $student1->id,
            'program_id' => $bscs->id,
            'status' => 'submitted',
            'personal_statement' => 'I am passionate about technology and want to contribute to Zimbabwe\'s growing tech sector after my studies.',
            'previous_education' => 'A-Levels at Prince Edward School, Harare',
            'grade_average' => 'A',
            'emergency_contact' => json_encode([
                'name' => 'Mary Mukamuri',
                'relationship' => 'Mother',
                'phone' => '+263712345678',
                'email' => 'mary.mukamuri@example.com'
            ]),
            'submitted_at' => now()->subDays(5),
        ]);

        Application::create([
            'user_id' => $student2->id,
            'program_id' => $bir->id,
            'status' => 'under_review',
            'personal_statement' => 'Growing up in Zimbabwe has given me unique insights into international relations in Southern Africa.',
            'previous_education' => 'A-Levels at Dominican Convent, Harare',
            'grade_average' => 'B+',
            'emergency_contact' => json_encode([
                'name' => 'Thomas Chigumba',
                'relationship' => 'Father',
                'phone' => '+263773456789',
                'email' => 'thomas.chigumba@example.com'
            ]),
            'submitted_at' => now()->subDays(10),
            'reviewed_at' => now()->subDays(3),
            'reviewed_by' => User::where('role', 'admin')->first()->id,
        ]);

        Application::create([
            'user_id' => $student3->id,
            'program_id' => $mba->id,
            'status' => 'approved',
            'personal_statement' => 'With 3 years of experience in international trade, I aim to expand my business knowledge through advanced education in Europe.',
            'previous_education' => 'Bachelor of Commerce, Beijing University',
            'grade_average' => '85%',
            'emergency_contact' => json_encode([
                'name' => 'Li Chen',
                'relationship' => 'Sister',
                'phone' => '+8613898765432',
                'email' => 'li.chen@example.com'
            ]),
            'submitted_at' => now()->subDays(20),
            'reviewed_at' => now()->subDays(8),
            'reviewed_by' => User::where('role', 'admin')->first()->id,
            'review_notes' => 'Excellent candidate with strong background and clear goals.',
        ]);

        Application::create([
            'user_id' => $student4->id,
            'program_id' => $bscs->id,
            'status' => 'draft',
            'personal_statement' => null,
            'previous_education' => 'High School Diploma, Delhi Public School',
            'grade_average' => '92%',
            'emergency_contact' => null,
        ]);
    }
}
