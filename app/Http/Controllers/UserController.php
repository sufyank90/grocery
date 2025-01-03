<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash; // Add this line



class UserController extends Controller
{
    public function index(Request $request){

        $this->authorize('viewAny', User::class);

        $users = User::where('name','like','%'.$request->search.'%')
        ->orWhere('email', 'like', '%' . $request->search . '%')
        ->role('user')->orderBy('id','desc')->paginate(50);
        
        return Inertia::render('user/User', compact('users'));
    }

    public function csvExport(Request $request)
    {
        $users = User::all();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=users.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
        
        // Define the columns for the CSV file
        $columns = [
            'Name',
            'Email',
            'Phone',
            'Wallet',
        ];
        
        // Create a callback to stream the CSV content
        $callback = function() use ($users, $columns) {
            $file = fopen('php://output', 'w');
            
            // Write the column headers
            fputcsv($file, $columns);
            
            // Write product data to the CSV
            foreach ($users as $user) {
               
                
                fputcsv($file, [
                    $user->name,
                    $user->email,
                    $user->phone,
                    $user->wallet
                ]);
            }
            
            fclose($file);
        };
        
        // Return the streamed CSV file as a download
        return response()->stream($callback, 200, $headers);
    }

    public function updateWallet(Request $request, $id)
    {
        $this->authorize('update', User::class);

        $request->validate([
            'wallet' => 'required|numeric|min:0',
        ]);
    
        // Fetch the user by ID
        $user = User::findOrFail($id);
    
        // Update the user's wallet balance
        $user->update(['wallet' => $request->wallet]);
    
        return redirect()->back()->with('success', 'Wallet updated successfully.');
    }

    //verify
    public function verify($id)
    {
        $this->authorize('update', User::class);

        $user = User::findOrFail($id);
        if ($user->hasVerifiedEmail()) {
            // Unverify
            $user->markEmailAsUnverified();
            session()->flash('message', 'Email unverified successfully!');
        } else {
            // Verify
            $user->markEmailAsVerified();
            session()->flash('message', 'Email verified successfully!');
        }
    }
    


    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'wallet' => 'required|numeric|min:0',
        ]);
    
        // Email existence ko manually check karein
        // $existingUser = User::where('email', $request->email)->first();
    
        // if ($existingUser) {
        //     return back()->withErrors(['email' => 'The email address is already registered.'])->withInput();
        // }
    
        // Agar email exist nahi karti, toh user create karein
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'wallet' => $request->wallet,
        ]);

        $user->markEmailAsVerified();
        
        // User role assign karein
        $user->assignRole('user');
    
        // Redirect back with success message
        return redirect()->back()->with('success', 'User created successfully!');
    }
    
    
    public function update(Request $request, $id)
    {
        $this->authorize('update', User::class);
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
        $this->authorize('delete', User::class);
        $user = User::findOrFail($id);  // Find the user by ID
        $user->delete();  // Delete the user
        return redirect()->back()->with('message', 'User deleted successfully!');
    }
}
