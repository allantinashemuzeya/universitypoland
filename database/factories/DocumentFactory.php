<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['passport', 'transcript', 'diploma', 'language_certificate', 'cv', 'recommendation_letter', 'other'];
        $statuses = ['pending', 'verified', 'rejected'];
        
        return [
            'application_id' => Application::factory(),
            'type' => $this->faker->randomElement($types),
            'file_name' => $this->faker->word() . '.' . $this->faker->randomElement(['pdf', 'jpg', 'png']),
            'file_path' => 'documents/' . $this->faker->uuid() . '/' . $this->faker->uuid() . '.pdf',
            'file_size' => $this->faker->numberBetween(100000, 5000000), // 100KB to 5MB
            'mime_type' => $this->faker->randomElement(['application/pdf', 'image/jpeg', 'image/png']),
            'description' => $this->faker->optional()->sentence(),
            'verification_status' => $this->faker->randomElement($statuses),
            'verified_by' => null,
            'verified_at' => null,
            'rejection_reason' => null,
        ];
    }

    /**
     * Indicate that the document is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => 'pending',
            'verified_by' => null,
            'verified_at' => null,
            'rejection_reason' => null,
        ]);
    }

    /**
     * Indicate that the document is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => 'verified',
            'verified_by' => 1, // Would normally be a user ID
            'verified_at' => now(),
            'rejection_reason' => null,
        ]);
    }

    /**
     * Indicate that the document is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => 'rejected',
            'verified_by' => 1, // Would normally be a user ID
            'verified_at' => now(),
            'rejection_reason' => $this->faker->sentence(),
        ]);
    }

    /**
     * Configure the factory for a specific document type.
     */
    public function type(string $type): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => $type,
        ]);
    }

    /**
     * Configure the factory for a PDF file.
     */
    public function pdf(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_name' => $this->faker->word() . '.pdf',
            'mime_type' => 'application/pdf',
        ]);
    }

    /**
     * Configure the factory for an image file.
     */
    public function image(): static
    {
        $extension = $this->faker->randomElement(['jpg', 'png']);
        return $this->state(fn (array $attributes) => [
            'file_name' => $this->faker->word() . '.' . $extension,
            'mime_type' => $extension === 'jpg' ? 'image/jpeg' : 'image/png',
        ]);
    }
}
