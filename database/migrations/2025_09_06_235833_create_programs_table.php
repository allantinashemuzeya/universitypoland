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
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->enum('degree_level', ['bachelor', 'master', 'phd']);
            $table->integer('duration_years');
            $table->string('language_of_instruction');
            $table->decimal('tuition_fee_per_year', 10, 2);
            $table->text('requirements');
            $table->date('application_deadline');
            $table->date('start_date');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
