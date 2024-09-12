<?php

namespace Database\Factories;
use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Setting>
 */
class SettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Setting::class;
    public function definition()
    {
        return [
            'key' => $this->faker->unique()->word, // Unique setting key
            'name' => $this->faker->words(2, true), // Human-readable name
            'value' => $this->faker->sentence, // Random value
            'type' => $this->faker->randomElement(['text', 'boolean', 'image']), // Random type
        ];
    }
}
