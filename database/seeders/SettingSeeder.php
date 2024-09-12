<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;
class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Setting::create([
            'key' => 'site_name',
            'name' => 'Site Name',
            'value' => 'My Awesome Website',
            'type' => 'text',
        ]);

        Setting::create([
            'key' => 'site_email',
            'name' => 'Site Email',
            'value' => 'admin@mywebsite.com',
            'type' => 'text',
        ]);

        Setting::create([
            'key' => 'site_logo',
            'name' => 'Site Logo',
            'value' => '/images/logo.png',
            'type' => 'image',
        ]);
        Setting::create([
            'key' => 'site_address',
            'name' => 'Site Address',
            'value' => 'abc street, xyz city',
            'type' => 'text',
        ]);

        Setting::create([
            'key' => 'product_rewards',
            'name' => 'Rewards Per Product',
            'value' => '10',
            'type' => 'text',
        ]);

        Setting::create([
            'key' => 'rewards_conversion',
            'name' => '1 RS = ? Points',
            'value' => '100',
            'type' => 'text',
        ]);

        // Generate random settings using the factory
        //Setting::factory(10)->create();
    }
}
