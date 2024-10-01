<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permssions = [
            ['name' => 'view products','guard_name' => 'web'],
            ['name' => 'create products','guard_name' => 'web'],
            ['name' => 'update products','guard_name' => 'web'],
            ['name' => 'delete products','guard_name' => 'web'],
            ['name' => 'view orders','guard_name' => 'web'],
            ['name' => 'create orders','guard_name' => 'web'],
            ['name' => 'update orders','guard_name' => 'web'],
            ['name' => 'delete orders','guard_name' => 'web'],
            ['name' => 'view categories','guard_name' => 'web'],
            ['name' => 'create categories','guard_name' => 'web'],
            ['name' => 'update categories','guard_name' => 'web'],
            ['name' => 'delete categories','guard_name' => 'web'],
            ['name' => 'view shipping rates','guard_name' => 'web'],
            ['name' => 'create shipping rates','guard_name' => 'web'],
            ['name' => 'update shipping rates','guard_name' => 'web'],
            ['name' => 'delete shipping rates','guard_name' => 'web'],
        ];

        Permission::insert($permssions);
   
    }
}
