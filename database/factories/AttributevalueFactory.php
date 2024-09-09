<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Attribute;
use App\Models\Attributealue;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attributevalue>
 */
class AttributevalueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $attribute = Attribute::inRandomOrder()->first();
        
        // Generate specific values based on attribute types
        $values = [];
        switch ($attribute->name) {
            case 'Size':
                $values = ['Small', 'Medium', 'Large'];
                break;
            case 'Color':
                $values = ['Red', 'Blue', 'Green', 'Yellow'];
                break;
            case 'Weight':
                $values = ['500g', '1kg', '2kg'];
                break;
            case 'Pack':
                $values = ['Pack of 1', 'Pack of 5', 'Pack of 10'];
                break;
        }

        return [
            'attribute_id' => $attribute->id,
            'value' => $this->faker->unique()->randomElement($values),
        ];
    }
}
