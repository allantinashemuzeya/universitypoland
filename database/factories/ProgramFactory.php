<?php

namespace Database\Factories;

use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Program>
 */
class ProgramFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Program::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $degreeTypes = ['bachelor', 'master', 'phd', 'diploma'];
        $faculties = [
            'Faculty of Computer Science',
            'Faculty of Business',
            'Faculty of Engineering',
            'Faculty of Social Sciences',
            'Faculty of Law',
            'Faculty of Medicine',
        ];

        return [
            'name' => fake()->randomElement(['Bachelor', 'Master', 'PhD']) . ' of ' . fake()->jobTitle(),
            'code' => strtoupper(fake()->unique()->bothify('???###')),
            'description' => fake()->paragraph(3),
            'degree_type' => fake()->randomElement($degreeTypes),
            'duration_years' => fake()->numberBetween(1, 5),
            'faculty' => fake()->randomElement($faculties),
            'tuition_fee' => fake()->numberBetween(3000, 10000),
            'application_fee' => fake()->numberBetween(50, 200),
            'requirements' => fake()->paragraph(),
            'application_deadline' => fake()->dateTimeBetween('+1 month', '+6 months'),
            'start_date' => fake()->dateTimeBetween('+6 months', '+12 months'),
            'is_active' => true,
            'max_students' => fake()->numberBetween(50, 200),
        ];
    }

    /**
     * Indicate that the program is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the program deadline has passed.
     */
    public function deadlinePassed(): static
    {
        return $this->state(fn (array $attributes) => [
            'application_deadline' => now()->subDays(7),
        ]);
    }
}
