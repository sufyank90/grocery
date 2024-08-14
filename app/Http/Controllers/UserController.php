<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(){
        $users = User::orderBy('id','desc')->paginate(5);
        
        return Inertia::render('user/User', compact('users'));
    }
}
