<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('admin', AdminManagementController::class); 
    Route::put('admin/wallet/{id}', [AdminManagementController::class, 'updateWallet'])->name('admin.wallet');     
});
