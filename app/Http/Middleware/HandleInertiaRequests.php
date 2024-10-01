<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {


                // Retrieve flash messages
    $message = Session::get('message');
    $error = Session::get('error');
    
    // Clear the session flash messages after retrieving
    Session::forget(['message', 'error']); 

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                'superadmin' => Auth::user() ? Auth::user()->hasRole('super admin') : false
            ],

            'flash' => [
            'message' => $message,
            'error' => $error,
        ],

            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }
}
