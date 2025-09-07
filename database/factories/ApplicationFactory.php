<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\Program;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Application::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => 'student']),
            'program_id' => Program::factory(),
            'status' => 'draft',
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'date_of_birth' => fake()->dateTimeBetween('-30 years', '-18 years'),
            'nationality' => fake()->country(),
            'passport_number' => strtoupper(fake()->bothify('??######')),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'country' => fake()->country(),
            'postal_code' => fake()->postcode(),
            'education_level' => fake()->randomElement(['High School', 'Bachelor\'s Degree', 'Master\'s Degree']),
            'institution_name' => fake()->company() . ' ' . fake()->randomElement(['High School', 'University', 'College']),
            'graduation_year' => fake()->numberBetween(2018, 2023),
            'gpa' => fake()->randomFloat(2, 2.0, 4.0),
            'english_proficiency' => fake()->randomElement(['Native Speaker', 'IELTS', 'TOEFL', 'Cambridge English']),
            'english_test_score' => function (array $attributes) {
                if ($attributes['english_proficiency'] === 'Native Speaker') {
                    return null;
                }
                return fake()->randomElement(['7.5', '8.0', '6.5', '7.0']);
            },
            'motivation_letter' => fake()->paragraphs(3, true),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => fake()->phoneNumber(),
            'emergency_contact_relationship' => fake()->randomElement(['Parent', 'Sibling', 'Spouse', 'Guardian']),
            'submission_date' => null,
            'reviewed_at' => null,
            'reviewed_by' => null,
            'review_notes' => null,
        ];
    }

    /**
     * Indicate that the application is submitted.
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'submitted',
            'submission_date' => now(),
        ]);
    }

    /**
     * Indicate that the application is under review.
     */
    public function underReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'under_review',
            'submission_date' => now()->subDays(3),
        ]);
    }

    /**
     * Indicate that the application is accepted.
     */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'accepted',
            'submission_date' => now()->subDays(7),
            'reviewed_at' => now()->subDays(1),
            'reviewed_by' => User::factory()->state(['role' => 'admin']),
            'review_notes' => 'Application accepted. Congratulations!',
        ]);
    }

    /**
     * Indicate that the application is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'submission_date' => now()->subDays(7),
            'reviewed_at' => now()->subDays(1),
            'reviewed_by' => User::factory()->state(['role' => 'admin']),
            'review_notes' => 'Application does not meet the requirements.',
        ]);
    }
}
