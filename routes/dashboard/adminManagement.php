<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth','is_superadmin'])->prefix('dashboard')->group(function () {
    Route::resource('admin', AdminManagementController::class); 
});
