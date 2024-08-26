<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
//media-library
use Spatie\MediaLibrary\MediaCollections\Models\Media;
class SettingController extends Controller
{
    public function index(){
        return Inertia::render('setting/Home');
    }
  
}
