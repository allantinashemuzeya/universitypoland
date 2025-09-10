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
            $table->boolean('application_fee_paid')->default(false)->after('status');
            $table->timestamp('application_fee_paid_at')->nullable()->after('application_fee_paid');
            $table->boolean('commitment_fee_paid')->default(false)->after('application_fee_paid_at');
            $table->timestamp('commitment_fee_paid_at')->nullable()->after('commitment_fee_paid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn([
                'application_fee_paid',
                'application_fee_paid_at',
                'commitment_fee_paid',
                'commitment_fee_paid_at'
            ]);
        });
    }
};
