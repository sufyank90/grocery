<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
//validator
use Illuminate\Support\Facades\Validator;


class AdminManagementController extends Controller
{
    public function index(Request $request){
        $roles = Role::whereNotIn('name', ['user', 'super admin'])->pluck('name')->toArray();
        $users = User::where('name','like','%'.$request->search.'%')->with('roles')
        ->orWhere('email', 'like', '%' . $request->search . '%')
        ->role($roles)
       ->orderBy('id','desc')->paginate(10);

    
        return Inertia::render('setting/AdminManagement', compact('users','roles'));
    }

    
    


    public function store(Request $request)
    {

       $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required',
       ]);

       if($validator->fails()) {
           session()->flash('error', $validator->errors()->first());
            return back();
       }

       $user =  User::create([
        
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            
        ]);
        $user->assignRole($request->role);
        session()->flash('message', 'User created successfully!');
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
