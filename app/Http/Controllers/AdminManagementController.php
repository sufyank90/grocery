<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;



class AdminManagementController extends Controller
{
    public function index(Request $request){
        $users = User::where('name','like','%'.$request->search.'%')
        ->orWhere('email', 'like', '%' . $request->search . '%')
        ->role('admin')->orderBy('id','desc')->paginate(10);
        
        return Inertia::render('setting/AdminManagement', compact('users'));
    }

    
    


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            
        ]);

       $user =  User::create([
        
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            
        ]);
        $user->assignRole('admin');
        return redirect()->back(); // Or redirect to any desired route
    }

    

    

    public function update(Request $request, $id)
    {
        // dd($request->all());
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            
        ]);
        


        return redirect()->back()->with('message', 'User updated successfully!');
    }
    public function destroy($id)
    {
        $user = User::findOrFail($id);  // Find the user by ID
        $user->delete();  // Delete the user
        return redirect()->back()->with('message', 'User deleted successfully!');
    }
}
