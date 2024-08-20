<?php
namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->word(), // Generates a random product name
            'description' => $this->faker->sentence(), // Generates a random product description
            'price' => $this->faker->randomFloat(2, 1, 100), // Generates a random price between 1 and 100
            'status' => 'instock', // 80% chance of being true (active)
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Product $product) {
            // Attach the product to a random category
            $categoryIds = Category::inRandomOrder()->take(1)->pluck('id');
            $product->categories()->attach($categoryIds);
        });
    }
}
