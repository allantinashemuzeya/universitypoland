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
        Schema::table('documents', function (Blueprint $table) {
            // Rename status to verification_status
            if (Schema::hasColumn('documents', 'status') && !Schema::hasColumn('documents', 'verification_status')) {
                $table->renameColumn('status', 'verification_status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            if (Schema::hasColumn('documents', 'verification_status') && !Schema::hasColumn('documents', 'status')) {
                $table->renameColumn('verification_status', 'status');
            }
        });
    }
};
