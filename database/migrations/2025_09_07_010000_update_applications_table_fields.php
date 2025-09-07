<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            // Drop old columns
            $table->dropColumn(['personal_statement', 'previous_education', 'grade_average']);
            
            // Add new personal info columns
            $table->string('first_name')->after('program_id');
            $table->string('last_name')->after('first_name');
            $table->date('date_of_birth')->after('last_name');
            $table->string('nationality')->after('date_of_birth');
            $table->string('passport_number')->after('nationality');
            
            // Contact info
            $table->string('email')->after('passport_number');
            $table->string('phone')->after('email');
            $table->text('address')->after('phone');
            $table->string('city')->after('address');
            $table->string('country')->after('city');
            $table->string('postal_code')->after('country');
            
            // Education info
            $table->string('education_level')->after('postal_code');
            $table->string('institution_name')->after('education_level');
            $table->integer('graduation_year')->after('institution_name');
            $table->decimal('gpa', 3, 2)->nullable()->after('graduation_year');
            
            // English proficiency
            $table->string('english_proficiency')->after('gpa');
            $table->string('english_test_score')->nullable()->after('english_proficiency');
            
            // Motivation letter
            $table->text('motivation_letter')->after('english_test_score');
            
            // Emergency contact as individual fields instead of JSON
            $table->string('emergency_contact_name')->after('motivation_letter');
            $table->string('emergency_contact_phone')->after('emergency_contact_name');
            $table->string('emergency_contact_relationship')->after('emergency_contact_phone');
            
            // Rename submitted_at to submission_date
            $table->renameColumn('submitted_at', 'submission_date');
        });
        
        // Drop the emergency_contact JSON column in a separate statement
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('emergency_contact');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            // Add back old columns
            $table->text('personal_statement')->nullable();
            $table->string('previous_education');
            $table->string('grade_average')->nullable();
            $table->json('emergency_contact')->nullable();
            
            // Drop new columns
            $table->dropColumn([
                'first_name', 'last_name', 'date_of_birth', 'nationality', 'passport_number',
                'email', 'phone', 'address', 'city', 'country', 'postal_code',
                'education_level', 'institution_name', 'graduation_year', 'gpa',
                'english_proficiency', 'english_test_score', 'motivation_letter',
                'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship'
            ]);
            
            // Rename back
            $table->renameColumn('submission_date', 'submitted_at');
        });
    }
};
