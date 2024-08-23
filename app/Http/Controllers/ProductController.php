<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request; // Correct import statement

use App\Models\Category;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    
        $products = Product::orderBy('id','desc')->with('media')->paginate(10);
        $categories = Category::all();
        return Inertia::render('product/Product', compact('products','categories'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $categories = Category::all(); // Category data ko fetch karein, agar zarurat ho.
        return Inertia::render('product/Create', [
        'categories' => $categories,
    ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreProductRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreProductRequest $request)
    { 
        $product = Product::create($request->only(['name', 'description', 'price', 'status']));
        $product->categories()->attach($request->categories);
        if($request->file){
            $product->addMedia($request->file)->toMediaCollection();
        }
        session()->flash('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
    
        $categories = Category::all();

        $product->load(['categories', 'media']);

        return Inertia::render('product/Edit', [
        'categories' => $categories,
        'product' => $product,
    ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateProductRequest  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
      
    }


    public function updatewithfile(Request $request, Product $product)
    {
     
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:instock,outofstock,active',
       
        ];
       
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $product->update($request->only(['name', 'description', 'price', 'status']));

        $categories = explode(',', $request->categories);
        $categories = array_map('intval', $categories);
        $product->categories()->sync($categories);

        if ($request->hasFile('file')) {
            $product->clearMediaCollection();
            $product->addMedia($request->file('file'))->toMediaCollection();
        }     
        return redirect(route('product.index'))->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        // Delete the product
        $product->delete();

        // Return a response or redirect back with a success message
        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
