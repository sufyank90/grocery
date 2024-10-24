<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
class NewPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $permssions = [

            ['name' => 'view customers','guard_name' => 'web'],
            ['name' => 'create customers','guard_name' => 'web'],
            ['name' => 'update customers','guard_name' => 'web'],
            ['name' => 'delete customers','guard_name' => 'web'],
            ['name' => 'view coupons','guard_name' => 'web'],
            ['name' => 'create coupons','guard_name' => 'web'],
            ['name' => 'update coupons','guard_name' => 'web'],
            ['name' => 'delete coupons','guard_name' => 'web'],
            ['name' => 'view banners','guard_name' => 'web'],
            ['name' => 'create banners','guard_name' => 'web'],
            ['name' => 'update banners','guard_name' => 'web'],
            ['name' => 'delete banners','guard_name' => 'web'],

           
        ];

        
        Permission::insert($permssions);
   
    }
}
