<?php


use App\Http\Controllers\SettingController;
use App\Http\Controllers\BannerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->prefix('dashboard/setting')->group(function () {
    Route::get('', [SettingController::class, 'index'])->name('setting.index');
        Route::get('/posters', [SettingController::class, 'posters'])->name('setting.posters');
        // setting.posters.upload
        Route::post('/posters/upload', [SettingController::class, 'posters_upload'])->name('setting.posters.upload');
});


Route::middleware(['auth'])->prefix('dashboard/setting')->group(function () {
    Route::resource('banner', BannerController::class);
});

