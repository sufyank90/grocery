<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use App\Models\User;
use Illuminate\Foundation\Auth\VerifiesEmails;


class VerificationController extends Controller
{

    public function verify(Request $request, $id, $hash)
    {

        $user = User::findOrFail($id);
        
        // Verify the hash and if the email matches
        if (!hash_equals($hash, sha1($user->email))) {
            abort(401);
        }

        // Mark the user as verified
        if ($user->hasVerifiedEmail()) {
            //show message in html mail already verified in template
            $message = "Email already verified";
            return view('auth.verified', compact('message'));
        }

        $user->markEmailAsVerified();
        $message=  "Email Verified Successfully!";
        return view('auth.verified', compact('message'));
    }
}
