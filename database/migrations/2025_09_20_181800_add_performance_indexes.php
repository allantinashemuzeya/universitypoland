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
        // Add indexes to applications table
        Schema::table('applications', function (Blueprint $table) {
            $table->index('application_number');
            $table->index('status');
            $table->index(['user_id', 'status']);
            $table->index('submission_date');
            $table->index(['application_fee_paid', 'commitment_fee_paid']);
        });

        // Add indexes to payments table
        Schema::table('payments', function (Blueprint $table) {
            $table->index('stripe_payment_intent_id');
            $table->index(['application_id', 'type']);
            $table->index(['status', 'type']);
            $table->index('paid_at');
        });

        // Add indexes to documents table
        Schema::table('documents', function (Blueprint $table) {
            $table->index(['application_id', 'type']);
            $table->index('status');
        });

        // Add indexes to communications table
        Schema::table('communications', function (Blueprint $table) {
            $table->index(['user_id', 'is_read']);
            $table->index(['application_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropIndex(['application_number']);
            $table->dropIndex(['status']);
            $table->dropIndex(['user_id', 'status']);
            $table->dropIndex(['submission_date']);
            $table->dropIndex(['application_fee_paid', 'commitment_fee_paid']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['stripe_payment_intent_id']);
            $table->dropIndex(['application_id', 'type']);
            $table->dropIndex(['status', 'type']);
            $table->dropIndex(['paid_at']);
        });

        Schema::table('documents', function (Blueprint $table) {
            $table->dropIndex(['application_id', 'type']);
            $table->dropIndex(['status']);
        });

        Schema::table('communications', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'is_read']);
            $table->dropIndex(['application_id', 'created_at']);
        });
    }
};