<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'name' => 'Bachelor of Computer Science',
                'code' => 'BCS001',
                'description' => 'A comprehensive program covering software development, algorithms, data structures, and modern computing technologies.',
                'degree_type' => 'bachelor',
                'duration_years' => 3,
                'faculty' => 'Faculty of Computer Science',
                'tuition_fee' => 4500.00,
                'application_fee' => 100.00,
                'requirements' => 'High school diploma with mathematics, English proficiency (IELTS 6.0 or equivalent)',
                'application_deadline' => now()->addMonths(3),
                'start_date' => now()->addMonths(6),
                'is_active' => true,
                'max_students' => 150,
            ],
            [
                'name' => 'Master of Business Administration',
                'code' => 'MBA001',
                'description' => 'An advanced business degree focusing on leadership, strategic management, and entrepreneurship.',
                'degree_type' => 'master',
                'duration_years' => 2,
                'faculty' => 'Faculty of Business',
                'tuition_fee' => 6000.00,
                'application_fee' => 150.00,
                'requirements' => "Bachelor's degree, 2 years work experience, English proficiency (IELTS 6.5)",
                'application_deadline' => now()->addMonths(2),
                'start_date' => now()->addMonths(5),
                'is_active' => true,
                'max_students' => 100,
            ],
            [
                'name' => 'Bachelor of International Relations',
                'code' => 'BIR001',
                'description' => 'Study global politics, diplomacy, international law, and cross-cultural communication.',
                'degree_type' => 'bachelor',
                'duration_years' => 3,
                'faculty' => 'Faculty of Social Sciences',
                'tuition_fee' => 4000.00,
                'application_fee' => 100.00,
                'requirements' => 'High school diploma, English proficiency (IELTS 6.0 or equivalent)',
                'application_deadline' => now()->addMonths(4),
                'start_date' => now()->addMonths(7),
                'is_active' => true,
                'max_students' => 120,
            ],
            [
                'name' => 'Master of Data Science',
                'code' => 'MDS001',
                'description' => 'Learn advanced analytics, machine learning, and big data technologies.',
                'degree_type' => 'master',
                'duration_years' => 2,
                'faculty' => 'Faculty of Computer Science',
                'tuition_fee' => 5500.00,
                'application_fee' => 150.00,
                'requirements' => "Bachelor's in STEM, programming experience, English proficiency (IELTS 6.5)",
                'application_deadline' => now()->addMonths(3),
                'start_date' => now()->addMonths(6),
                'is_active' => true,
                'max_students' => 80,
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }
    }
}
