<?php

use App\Http\Controllers\RoleController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth','is_superadmin'])->prefix('dashboard')->group(function () {
    Route::resource('role', RoleController::class);   
    Route::put('role/{id}/updatePermission', [RoleController::class, 'updatePermission'])->name('role.updatePermission');
});
