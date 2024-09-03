<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash; // Add this line



class UserController extends Controller
{
    public function index(Request $request){
        $users = User::where('name','like','%'.$request->search.'%')
        ->orWhere('email', 'like', '%' . $request->search . '%')
        ->role('user')->orderBy('id','desc')->paginate(10);
        
        return Inertia::render('user/User', compact('users'));
    }



    public function updateWallet(Request $request, $id)
    {
        $request->validate([
            'wallet' => 'required|numeric|min:0',
        ]);
    
        // Fetch the user by ID
        $user = User::findOrFail($id);
    
        // Update the user's wallet balance
        $user->update(['wallet' => $request->wallet]);
    
        return redirect()->back()->with('success', 'Wallet updated successfully.');
    }
    


    public function store(Request $request)
{

    
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
        'wallet' => 'required|numeric|min:0',
    ]);

    

    // Create the user
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'wallet' => $request->wallet,
    ]);

    // Assign role to the user
    $user->assignRole('user');

    // Redirect back or to any other route
    return redirect()->back()->with('success', 'User created successfully!');
}
    public function update(Request $request, $id)
    {
        // dd($request->all());
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'wallet' => 'required|numeric|min:0',
            
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'wallet' => $request->wallet,
            
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
