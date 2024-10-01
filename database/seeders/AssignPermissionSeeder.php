<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AssignPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //assign permission to super admin role role_has_permissions



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
        
         // Fetch the existing super admin role
        $superAdminRole = Role::where('name', 'super admin')->first();

        // Check if the super admin role exists before syncing permissions
        if ($superAdminRole) {
            // Assign permissions to the super admin role
            $superAdminRole->syncPermissions($assignPermissionToSuperAdmin);
        } else {
            // Optionally, handle the case where the role does not exist
            \Log::warning('Super admin role not found.');
        }
    }
}
