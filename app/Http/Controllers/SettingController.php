<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;
//media-library
use Spatie\MediaLibrary\MediaCollections\Models\Media;
class SettingController extends Controller
{
    public function index(){
        return Inertia::render('setting/Home');
    }
    public function all(){
        $settings = Setting::all();
        $formattedSettings = $settings->pluck('value', 'key'); // Returns key-value pair array
        $data = Setting::all();
        return Inertia::render('setting/Index', ['settings' => $formattedSettings, 'rows' => $data]);
    }
    public function update(Request $request){
        //return $request->all();
        // $request->validate([
        //     'site_name' => 'required|string|max:255',
        //     'site_email' => 'required|email|max:255',
        //     'site_logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        // ]);
    
        // $settings = [
        //     'site_name' => $request->site_name,
        //     'site_email' => $request->site_email,
        // ];
    
        // // Handle file upload for the logo
        // if ($request->hasFile('site_logo')) {
        //     $path = $request->file('site_logo')->store('logos', 'public');
        //     $settings['site_logo'] = $path;
        // }
        dd($request->all());
    
        // Update each setting
        foreach ($request->all() as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    
        return redirect()->back()->with('success', 'Settings updated successfully.');
        //return Inertia::render('setting/Index');
    }
  
}
