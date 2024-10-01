<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Permission;

class AssignPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::role('super admin')->first();

        $assignPermissionToSuperAdmin = [
            'view products',
            'create products',
            'update products',
            'delete products',
            'view orders',
            'create orders',
            'update orders',
            'delete orders',
            'view categories',
            'create categories',
            'update categories',
            'delete categories',
            'view shipping rates',
            'create shipping rates',
            'update shipping rates',
            'delete shipping rates',
        ];
        
        // Create permissions if they do not exist
        foreach ($assignPermissionToSuperAdmin as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
        
        // Assign permissions to the user
        $user->syncPermissions($assignPermissionToSuperAdmin);
    }
}
