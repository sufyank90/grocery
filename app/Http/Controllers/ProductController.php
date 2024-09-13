<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request; // Correct import statement

use App\Models\Category;
use App\Models\Attribute;
use App\Models\ShippingRate;
use App\Models\Attributevalue;
//Response
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;



class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function csvstore(Request $request)
    {
       
    //    name,description,price,status,sku,sale_price,regular_price,tax_class,tax
        $jsonData = json_decode($request->getContent(), true);

        if (!$jsonData) {
            return response()->json(['error' => 'Invalid JSON data'], 400);
        }

        foreach ($jsonData as $data) {
            $product = Product::create(['name' => $data['name'], 'description' => $data['description'], 'price' => $data['price'], 'status' => $data['status'], 'sku' => $data['sku'], 'sale_price' => $data['sale_price'], 'regular_price' => $data['regular_price'] , 'tax_class' => $data['tax_class'], 'tax' => $data['tax'] ]);
        }

        // Flash success message to session
        session()->flash('message', 'Records created successfully!');

        // Redirect back to previous page or any desired route
        return redirect()->back();
    }

    public function csvExport(Request $request)
    {
  
        // Fetch all products from the database
        $products = Product::all();
    
        // Define the headers for the CSV file
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=products.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
    
        // Define the columns for the CSV file
        $columns = ['name', 'description', 'price', 'status', 'sku', 'sale_price', 'regular_price', 'tax_class', 'tax'];
    
        // Create a callback to stream the CSV content
        $callback = function() use ($products, $columns) {
            $file = fopen('php://output', 'w');
            
            // Write the column headers
            fputcsv($file, $columns);
    
            // Write product data to the CSV
            foreach ($products as $product) {
                fputcsv($file, [
                    $product->name,
                    $product->description,
                    $product->price,
                    $product->status,
                    $product->sku,
                    $product->sale_price,
                    $product->regular_price,
                    $product->tax_class,
                    $product->tax
                ]);
            }
    
            fclose($file);
        };
    
        // Return the streamed CSV file as a download
       
        return response()->stream($callback, 200, $headers);

    }
    

    public function index(Request $request)
    {
       
    
        $products = Product::where('name','like','%'.$request->search.'%')
        ->orwhere('description','like','%'.$request->search.'%')
        ->orderBy('id','desc')->with('media','shipping_rates','attributeValues','attributeValues.attribute')->paginate(10);
      
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
        $categories = Category::all();
        
        $attribute = Attributevalue::with('attribute')->get();
      


        $shippingRates = ShippingRate::all(['id', 'area_name'] );

        $formattedShippingRates = $shippingRates->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->area_name ,

            ];
        });
        
        return Inertia::render('product/Create', [
        'categories' => $categories,
        'shippingRates' => $formattedShippingRates,
        'attribute' => $attribute
    ]);
    }


    public function status(Request $request, $id)
    {
        // Debugging: Output all request data
        //dd($request->all()); // You might want to comment this out after testing
    
        $product = Product::find($id);
    
        if ($product) {
            $product->status = $request->status;
    
    
            $product->save();
    
            return redirect()->back()->with('success', 'product status updated successfully.');
        }
    
        return redirect()->back()->with('error', 'Product not found.');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreProductRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreProductRequest $request)
    { 
        $product = Product::create($request->only(['name', 'description', 'price', 'status', 'sku', 'sale_price', 'regular_price', 'tax_class', 'tax', 'stock_count']));
        $product->categories()->attach($request->categories);
        $product->attributeValues()->attach($request->attribute_id);
        // if($request->file){
        //     $product->addMedia($request->file)->toMediaCollection();
        // }
        if ($request->hasFile('file')) {
            foreach ($request->file('file') as $file) {
                $product->addMedia($file)->toMediaCollection();
            }
        }
        $product->shipping_rates()->attach($request->shipping_rates);
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
    
        $shippingRates = ShippingRate::all(['id', 'area_name']);


        $formattedShippingRates = $shippingRates->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->area_name ,
            ];
        });


        $defaultshippingrate = $product->shipping_rates->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->area_name,
            ];
        });

        $categories = Category::all();

        //$attribute = Attributevalue::with('attribute')->get();
        $attribute = Attribute::with('attributeValues')->get();
        $attributeValues = $product->attributeValues()->pluck('id');
        //dd($attributeValues);
        $product->load(['categories', 'media']);
        // dd([
        //     'categories' => $categories,
        //     'product' => $product,
        //     'shippingRates' => $formattedShippingRates,
        //     'defaultshippingrate' => $defaultshippingrate
        // ]);
        return Inertia::render('product/Edit', [
        'categories' => $categories,
        'product' => $product,
        'shippingRates' => $formattedShippingRates,
        'defaultshippingrate' => $defaultshippingrate,
        'attribute' => $attribute,
        'attributeValues' => $attributeValues
        
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
            'sku' => 'required|string|max:255',
            'sale_price' => 'nullable|numeric|min:0',
            'regular_price' => 'nullable|numeric|min:0',
            'tax_class' => 'nullable|string|max:255',
            'tax' => 'nullable|string|max:255',
            'stock_count' => 'nullable|numeric|min:0',
       
        ];
       
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $product->update($request->only(['name', 'description', 'price', 'status', 'sku', 'sale_price', 'regular_price', 'tax_class', 'tax', 'stock_count']));
        

        $categories = explode(',', $request->categories);
        $categories = array_map('intval', $categories);
        $product->categories()->sync($categories);

        $attributes = explode(',', $request->attribute_id);
        $attributes = array_map('intval', $attributes);
        $product->attributeValues()->sync($attributes);
        if(!empty($request->shipping_rates)){
            $shipping_rates = explode(',', $request->shipping_rates);
            $shipping_rates = array_map('intval', $shipping_rates);
            $product->shipping_rates()->sync($shipping_rates);
        }
        else{
            $product->shipping_rates()->detach();
        }
     
        // if ($request->hasFile('file')) {
        //     $product->clearMediaCollection();
        //     $product->addMedia($request->file('file'))->toMediaCollection();
        // }  
        // if ($request->hasFile('file')) {
        //     $product->clearMediaCollection();
        //     $product->addMedia($request->file('file'))->toMediaCollection();
        // }   

        if($request->has('ids')){
            $product->media()->whereNotIn('id', $request->ids)->delete();
        }
        if ($request->hasFile('file')) {
            foreach ($request->file('file') as $file) {
                $product->addMedia($file)->toMediaCollection();
            }
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
