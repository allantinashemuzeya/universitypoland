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
        // For SQLite, we need to recreate the column with the new enum values
        Schema::table('applications', function (Blueprint $table) {
            // Drop the old column
            $table->dropColumn('status');
        });
        
        Schema::table('applications', function (Blueprint $table) {
            // Add the new column with updated enum values
            $table->enum('status', ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted'])
                  ->default('draft')
                  ->after('program_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        
        Schema::table('applications', function (Blueprint $table) {
            // Restore the old enum values
            $table->enum('status', ['draft', 'submitted', 'under_review', 'documents_requested', 'approved', 'rejected', 'withdrawn'])
                  ->default('draft')
                  ->after('program_id');
        });
    }
};
