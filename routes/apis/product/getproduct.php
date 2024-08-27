<?php

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use App\Models\User;
// use App\Models\Product;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Validation\Rules;

// Route::middleware('auth:sanctum')->prefix('product')->group(function () {


//     Route::get('',function(Request $request){
//         $data = Product::with('categories')->with('media','shipping_rates')->whereHas('shipping_rates', function ($q) use ($shipping_area) {
//             $q->where('area_name', $shipping_area);
//         })->orderBy('id','desc')->get();
//         return response()->json(["data"=>$data,"message"=>"success"], 200);

//     });

//     Route::get('/{slug}',function(Request $request,$slug){
//         $data = Product::with('categories')->with('media')->where('name','like','%'.$slug.'%')->orderBy('id','desc')->get();
//         return response()->json(["data"=>$data,"message"=>"success"], 200);
//     });

//     Route::get('/category/{category}',function(Request $request,$category){
//         // goto category then apply filter
//         $data = Product::with('categories')->with('media')->whereHas('categories', function ($q) use ($category) {
//             $q->where('name', $category);
//         })->orderBy('id','desc')->get();
//         return response()->json(["data"=>$data,"message"=>"success"], 200);
//     });

//     Route::get('/category/{category}/{slug}',function(Request $request,$category,$slug){
//         // goto category then apply filter
//         $data = Product::with('categories')->with('media')->where('name','like','%'.$slug.'%')->whereHas('categories', function ($q) use ($category) {
//             $q->where('name', $category);
//         })->orderBy('id','desc')->get();
//         return response()->json(["data"=>$data,"message"=>"success"], 200);
//     });

// });

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Product;

Route::middleware('auth:sanctum')->prefix('product')->group(function () {

    // Route to get all products with optional shipping_area filtering
    Route::get('', function(Request $request) {
        // Retrieve the optional query parameters
        $shipping_area = $request->query('shipping_area');

        // Build the query
        $query = Product::with('categories', 'media', 'shipping_rates');

        // Apply whereHas conditionally
        if ($shipping_area) {
            $query->whereHas('shipping_rates', function ($q) use ($shipping_area) {
                $q->where('area_name', $shipping_area);
            });
        }

        // Execute the query
        $data = $query->orderBy('id', 'desc')->get();

        return response()->json(["data" => $data, "message" => "success"], 200);
    });

    // Route to get products by slug with optional shipping_area filtering
    Route::get('/{slug}', function(Request $request, $slug) {
        // Retrieve the optional query parameters
        $shipping_area = $request->query('shipping_area');

        // Build the query
        $query = Product::with('categories', 'media')
            ->where('name', 'like', '%' . $slug . '%');

        // Apply whereHas conditionally
        if ($shipping_area) {
            $query->whereHas('shipping_rates', function ($q) use ($shipping_area) {
                $q->where('area_name', $shipping_area);
            });
        }

        // Execute the query
        $data = $query->orderBy('id', 'desc')->get();

        return response()->json(["data" => $data, "message" => "success"], 200);
    });

    // Route to get products by category with optional shipping_area filtering
    Route::get('/category/{category}', function(Request $request, $category) {
        // Retrieve the optional query parameters
        $shipping_area = $request->query('shipping_area');

        // Build the query
        $query = Product::with('categories', 'media')
            ->whereHas('categories', function ($q) use ($category) {
                $q->where('name', $category);
            });

        // Apply whereHas conditionally
        if ($shipping_area) {
            $query->whereHas('shipping_rates', function ($q) use ($shipping_area) {
                $q->where('area_name', $shipping_area);
            });
        }

        // Execute the query
        $data = $query->orderBy('id', 'desc')->get();

        return response()->json(["data" => $data, "message" => "success"], 200);
    });

    // Route to get products by category and slug with optional shipping_area filtering
    Route::get('/category/{category}/{slug}', function(Request $request, $category, $slug) {
        // Retrieve the optional query parameters
        $shipping_area = $request->query('shipping_area');

        // Build the query
        $query = Product::with('categories', 'media')
            ->where('name', 'like', '%' . $slug . '%')
            ->whereHas('categories', function ($q) use ($category) {
                $q->where('name', $category);
            });

        // Apply whereHas conditionally
        if ($shipping_area) {
            $query->whereHas('shipping_rates', function ($q) use ($shipping_area) {
                $q->where('area_name', $shipping_area);
            });
        }

        // Execute the query
        $data = $query->orderBy('id', 'desc')->get();

        return response()->json(["data" => $data, "message" => "success"], 200);
    });

});
