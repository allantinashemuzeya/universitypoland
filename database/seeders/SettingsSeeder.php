<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Application fee settings
        Setting::updateOrCreate(
            ['key' => 'application_fee_amount'],
            [
                'value' => '5000', // €50 in cents
                'type' => 'integer',
                'group' => 'fees',
                'description' => 'Application fee amount in cents'
            ]
        );

        // Commitment fee settings
        Setting::updateOrCreate(
            ['key' => 'commitment_fee_amount'],
            [
                'value' => '30000', // €300 in cents
                'type' => 'integer',
                'group' => 'fees',
                'description' => 'Commitment fee amount in cents'
            ]
        );
    }
}