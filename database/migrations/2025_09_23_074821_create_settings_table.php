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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value');
            $table->string('type')->default('string'); // string, integer, boolean, json
            $table->string('group')->default('general');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Insert default fee settings
        DB::table('settings')->insert([
            [
                'key' => 'application_fee_amount',
                'value' => '5000',
                'type' => 'integer',
                'group' => 'fees',
                'description' => 'Application fee amount in cents (EUR)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'commitment_fee_amount',
                'value' => '35000',
                'type' => 'integer',
                'group' => 'fees',
                'description' => 'Commitment fee amount in cents (EUR)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
