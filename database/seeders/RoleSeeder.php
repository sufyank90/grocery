<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //make roles admin , user
        $roles = [
            ['name' => 'user', 'guard_name' => 'web'],
            ['name' => 'admin', 'guard_name' => 'web'],
        ];
        Role::insert($roles);
    }
}
