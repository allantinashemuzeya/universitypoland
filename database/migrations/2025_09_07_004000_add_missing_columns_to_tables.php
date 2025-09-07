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
        // Add is_active column to users table if it doesn't exist
        if (!Schema::hasColumn('users', 'is_active')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('is_active')->default(true);
            });
        }

        // Add missing columns to programs table
        if (!Schema::hasColumn('programs', 'code')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->string('code', 50)->default('TEMP');
                $table->string('faculty')->default('Faculty of Information Technology');
                $table->decimal('application_fee', 10, 2)->default(0);
                $table->integer('max_students')->default(100);
            });
        }
        
        // Make language_of_instruction nullable
        if (Schema::hasColumn('programs', 'language_of_instruction')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->string('language_of_instruction')->nullable()->change();
            });
        }

        // Update existing programs with proper codes
        $programs = \App\Models\Program::all();
        foreach ($programs as $index => $program) {
            $program->update(['code' => 'PROG' . str_pad($program->id, 3, '0', STR_PAD_LEFT)]);
        }

        // Rename columns in programs table to match controller expectations
        if (Schema::hasColumn('programs', 'degree_level') && !Schema::hasColumn('programs', 'degree_type')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->renameColumn('degree_level', 'degree_type');
            });
        }

        if (Schema::hasColumn('programs', 'tuition_fee_per_year') && !Schema::hasColumn('programs', 'tuition_fee')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->renameColumn('tuition_fee_per_year', 'tuition_fee');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });

        Schema::table('programs', function (Blueprint $table) {
            $table->dropColumn(['code', 'faculty', 'application_fee', 'max_students']);
        });

        if (Schema::hasColumn('programs', 'degree_type')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->renameColumn('degree_type', 'degree_level');
            });
        }

        if (Schema::hasColumn('programs', 'tuition_fee')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->renameColumn('tuition_fee', 'tuition_fee_per_year');
            });
        }
    }
};
