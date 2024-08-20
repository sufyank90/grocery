<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $categories = [
            'Fruits & Vegetables',
            'Dairy & Eggs',
            'Bakery & Bread',
            'Meat & Seafood',
            'Snacks & Sweets',
            'Beverages',
            'Cereals & Breakfast',
            'Frozen Foods',
            'Pasta & Noodles',
            'Rice & Grains',
            'Canned Goods',
            'Condiments & Sauces',
            'Spices & Herbs',
            'Oil & Vinegar',
            'Personal Care',
            'Household Supplies',
            'Baby Products',
            'Pet Supplies',
            'Health & Wellness',
            'Organic & Specialty Foods'
        ];
        
        return [
            'name' => $this->faker->unique()->randomElement($categories),// Generates a random word for the category name
        ];
    }
}
