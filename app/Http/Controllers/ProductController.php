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
use App\Models\Variation;
//Response
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

use Illuminate\Support\Facades\DB;
use Exception;



class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function csvstore(Request $request)
    // {
    //     $this->authorize('create', Product::class);
        
    //     try{
    //         $jsonData = json_decode($request->getContent(), true);

    //         if (!$jsonData) {
    //             return response()->json(['error' => 'Invalid JSON data'], 400);
    //         }
    //         foreach ($jsonData as $data) {
    //             $product = Product::create([
    //                 'name' => $data['name'],
    //                 'description' => $data['description'], 
    //                 'price' => intVal($data['price']) ? intVal($data['price']) : 0, 
    //                 'status' => $data['status'], 
    //                 'sku' => $data['sku'], 
    //                 'sale_price' => intVal($data['sale_price']) ? intVal($data['sale_price']) : 0, 
    //                 'regular_price' => intVal($data['regular_price']) ? intVal($data['regular_price']) : 0, 
    //                 'tax_class' => $data['tax_class'], 
    //                 'tax' => intVal($data['tax']) ? intVal($data['tax']) : 0,
    //                 'stock_count' => intVal($data['stock_count']) ? intVal($data['stock_count']) : 0 ,
                    

    //                 ]);
    //         }

    //         // Flash success message to session
    //         session()->flash('message', 'Records created successfully!');

    //         // Redirect back to previous page or any desired route
    //         return redirect()->back();
    //     } catch (Exception $e) {
    //         // Handle exceptions
    //         session()->flash('error', 'Failed to import product: ' . $e->getMessage());
           
    //     }
    // }


public function csvstore(Request $request)
{

    $this->authorize('create', Product::class);

    $file = $request->file('file');

    if ($file) {
        // Store the file in storage/app/productscvs
        $path = $file->storeAs('productscvs', $file->getClientOriginalName(), 'public');

        if ($path) {
            // Construct the full path to the stored file
            $fullPath = storage_path('app/public/' . $path);

            // Check if the file exists before attempting to read
            if (file_exists($fullPath)) {
                // Read the CSV data into an array
                $data = array_map('str_getcsv', file($fullPath));

                if($data[0] != ['name','description','price','status','sku','sale_price','regular_price','tax_class','tax','stock_count']){
                    unlink($fullPath);
                    session()->flash('error', 'Invalid CSV/EXCEL file');
                    return redirect()->back();
                }
                $products = [];

                array_shift($data);
                foreach ($data as $row) {

                    $products[] = [
                        'name' => $row[0],
                        'description' => $row[1] ?: '',
                        'price' => intval($row[2]) ? intval($row[2]) : 0,
                        'status' => $row[3] || 'instock',
                        'sku' => $row[4],
                        'sale_price' => intval($row[5]) ? intval($row[5]) : 0,
                        'regular_price' => intval($row[6]) ? intval($row[6]) : 0,
                        'tax_class' => $row[7],
                        'tax' => intval($row[8]) ? intval($row[8]) : 0,
                        'stock_count' => intval($row[9]) ? intval($row[9]) : 0
                    ];
                }


                Product::insert($products);

                unlink($fullPath);
  
                session()->flash('message', 'Records created successfully!');
                return redirect()->back();
            } else {
                session()->flash('error', 'File could not be found after upload.');
                return redirect()->back();
            }
        }
    } else {
        session()->flash('error', 'File not found.');
        return redirect()->back();
    }

    // try {
    //     $jsonData = json_decode($request->getContent(), true);

    //     if (!$jsonData) {
    //         return response()->json(['error' => 'Invalid JSON data'], 400);
    //     }

    //     DB::beginTransaction();
    //     // dd($jsonData);
    //     foreach ($jsonData as $data) {
    //         try {
                
    //             $product = Product::create([
    //                 'name' => $data['name'],
    //                 'description' => $data['description'], 
    //                 'price' => intval($data['price']) ?: 0, 
    //                 'status' => $data['status'], 
    //                 'sku' => $data['sku'], 
    //                 'sale_price' => intval($data['sale_price']) ?: 0, 
    //                 'regular_price' => intval($data['regular_price']) ?: 0, 
    //                 'tax_class' => $data['tax_class'], 
    //                 'tax' => intval($data['tax']) ?: 0,
    //                 'stock_count' => intval($data['stock_count']) ?: 0,
    //             ]);
    //         } catch (Exception $e) {
    //             session()->flash('error', 'Failed to import one or more products. Please check the log for details.');
    //             DB::rollBack();
    //             return redirect()->back();
    //         }
    //     }
    //     DB::commit(); 
    //     session()->flash('message', 'Records created successfully!');

    //     return redirect()->back();
    // } catch (Exception $e) {

    //     DB::rollBack();
    //     session()->flash('error', 'Failed to import products: ' . $e->getMessage());
    //     return redirect()->back();
    // }
}


    // public function csvExport(Request $request)
    // {
        
  
    //     // Fetch all products from the database
    //     $products = Product::all();
        
    //     // Define the headers for the CSV file
    //     $headers = [
    //         "Content-type"        => "text/csv",
    //         "Content-Disposition" => "attachment; filename=products.csv",
    //         "Pragma"              => "no-cache",
    //         "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
    //         "Expires"             => "0"
    //     ];
    
    //     // Define the columns for the CSV file
    //     $columns = ['name', 'description', 'price', 'status', 'sku', 'sale_price', 'regular_price', 'tax_class', 'tax','stock_count'];
    
    //     // Create a callback to stream the CSV content
    //     $callback = function() use ($products, $columns) {
    //         $file = fopen('php://output', 'w');
            
    //         // Write the column headers
    //         fputcsv($file, $columns);
    
    //         // Write product data to the CSV
    //         foreach ($products as $product) {
    //             fputcsv($file, [
    //                 $product->name,
    //                 $product->description,
    //                 $product->price,
    //                 $product->status,
    //                 $product->sku,
    //                 $product->sale_price,
    //                 $product->regular_price,
    //                 $product->tax_class,
    //                 $product->tax,
    //                 $product->stock_count
    //             ]);
    //         }
    
    //         fclose($file);
    //     };
    
    //     // Return the streamed CSV file as a download
       
    //     return response()->stream($callback, 200, $headers);

    // }

    // public function csvExport(Request $request)
    // {
    //     // Fetch all products from the database with their attributes
    //     $products = Product::with('attributes','categories')->get();
    //     $categories = Category::all();
        
        
    //     // Define the headers for the CSV file
    //     $headers = [
    //         "Content-type"        => "text/csv",
    //         "Content-Disposition" => "attachment; filename=products.csv",
    //         "Pragma"              => "no-cache",
    //         "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
    //         "Expires"             => "0"
    //     ];
        
    //     // Define the columns for the CSV file
    //     $columns = ['name', 'description', 'price', 'status', 'sku', 'sale_price', 'regular_price', 'tax_class', 'tax', 'stock_count', 'attributes','categories'];
        
    //     // Create a callback to stream the CSV content
    //     $callback = function() use ($products, $columns) {
    //         $file = fopen('php://output', 'w');
            
    //         // Write the column headers
    //         fputcsv($file, $columns);
            
    //         // Write product data to the CSV
    //         foreach ($products as $product) {
    //             // Prepare attributes and their values
    //             $attributes = $product->attributes->map(function ($attribute) {
                    
    //                 return $attribute->name . ': ' . $attribute->value; // Adjust field names as needed
    //             });
    //             $attributesString = implode('; ', $attributes->toArray()); // Convert array to string
                
    //             fputcsv($file, [
    //                 $product->name,
    //                 $product->description,
    //                 $product->price,
    //                 $product->status,
    //                 $product->sku,
    //                 $product->sale_price,
    //                 $product->regular_price,
    //                 $product->tax_class,
    //                 $product->tax,
    //                 $product->stock_count,
    //                 $attributesString, // Add attributes and their values to the CSV
    //                 $categories
    //             ]);
    //         }
            
    //         fclose($file);
    //     };
        
    //     // Return the streamed CSV file as a download
    //     return response()->stream($callback, 200, $headers);
    // }

    public function csvExport(Request $request)
{
    // Fetch all products from the database with their attributes and categories
    $products = Product::with(['attributes', 'categories'])->get();
    
    // Define the headers for the CSV file
    $headers = [
        "Content-type"        => "text/csv",
        "Content-Disposition" => "attachment; filename=products.csv",
        "Pragma"              => "no-cache",
        "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
        "Expires"             => "0"
    ];
    
    // Define the columns for the CSV file
    $columns = [
        'name',
        'description',
        'price',
        'status',
        'sku',
        'sale_price',
        'regular_price',
        'tax_class',
        'tax',
        'stock_count',
        'attributes',
        'categories'
    ];
    
    // Create a callback to stream the CSV content
    $callback = function() use ($products, $columns) {
        $file = fopen('php://output', 'w');
        
        // Write the column headers
        fputcsv($file, $columns);
        
        // Write product data to the CSV
        foreach ($products as $product) {
            // Prepare attributes and their values
            $attributes = $product->attributes->map(function ($attribute) {
                return $attribute->name . ': ' . $attribute->value; // Adjust field names as needed
            });
            $attributesString = implode('; ', $attributes->toArray()); // Convert array to string
            
            // Prepare categories
            $categories = $product->categories->map(function ($category) {
                return $category->name; // Adjust field names as needed
            });
            $categoriesString = implode('; ', $categories->toArray()); // Convert array to string
            
            fputcsv($file, [
                $product->name,
                $product->description,
                $product->price,
                $product->status,
                $product->sku,
                $product->sale_price,
                $product->regular_price,
                $product->tax_class,
                $product->tax,
                $product->stock_count,
                $attributesString, // Add attributes and their values to the CSV
                $categoriesString // Add categories to the CSV
            ]);
        }
        
        fclose($file);
    };
    
    // Return the streamed CSV file as a download
    return response()->stream($callback, 200, $headers);
}

    public function index(Request $request)
    {
       
        $this->authorize('viewAny', Product::class);
        
        $products = Product::where('name','like','%'.$request->search.'%')
        ->orwhere('description','like','%'.$request->search.'%')
        ->orderBy('id','desc')->with('media','shipping_rates')->paginate(10);
      
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
        $this->authorize('create', Product::class);

        $categories = Category::all();
        $attribute = Attribute::with('attributeValues')->get();
        //$attribute = Attributevalue::with('attribute')->get();
      


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
        $this->authorize('update', $product);
    
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
    // public function store(StoreProductRequest $request)
    // { 
        

    //     $this->authorize('create', Product::class);
    //     //   dd($request->attributesdata);
    //     $product = Product::create($request->only(['name', 'description', 'price', 'status', 'sku', 'sale_price', 'regular_price', 'tax_class', 'tax', 'stock_count','variation']));
    //     $product->categories()->attach($request->categories);
        

    //     if($request->variation === 'variation'){
    //         $collection = [];
    //         $variations = $request->variations;

    //             if (is_string($variations)) {
    //                 $variations = json_decode($variations);
    //             }

    //         foreach ($variations as $variation) {
    //             //dd($variation);
    //             // Add the product ID and attributes to the collection
    //             $collection[] = [
    //                 'product_id' =>$product->id,
    //                 'attributes' =>  json_encode($variation["attribute"]),
    //                 'sale_price' =>$variation["sale_price"],
    //                 'regular_price' => $variation["regular_price"],
    //                 'sku' =>$variation["sku"],
    //                 'status' => $variation["status"], // Default value
    //                 'stock_count' => $variation["stock_count"],
    //             ];
    //         }
    //         Variation::insert($collection);
    //     }


    //     $product->attributes()->attach($request->attributesdata);
    //     // if($request->file){
    //     //     $product->addMedia($request->file)->toMediaCollection();
    //     // }
    //     if ($request->hasFile('file')) {
    //         foreach ($request->file('file') as $file) {
    //             $product->addMedia($file)->toMediaCollection();
    //         }
    //     }
    //     $product->shipping_rates()->attach($request->shipping_rates);
    //     session()->flash('success', 'Product created successfully.');
    // }
    public function store(StoreProductRequest $request)
{
    
    $this->authorize('create', Product::class);
    
    try {
        // Create the product
        $product = Product::create($request->only([
            'name', 'description', 'price', 'status', 
            'sku', 'sale_price', 'regular_price', 
            'tax_class', 'tax', 'stock_count', 'variation'
        ]));
        
        // Attach categories
        $product->categories()->attach($request->categories);

        // Handle variations if applicable
        if ($request->variation === 'variation') {
            $collection = [];
            $variations = $request->variations;

            // Decode variations if it's a string
            if (is_string($variations)) {
                $variations = json_decode($variations, true);
            }

            foreach ($variations as $variation) {
                $collection[] = [
                    'product_id' => $product->id,
                    'attributes' => json_encode($variation["attribute"]),
                    'sale_price' => $variation["sale_price"],
                    'regular_price' => $variation["regular_price"],
                    'sku' => $variation["sku"],
                    'status' => $variation["status"], // Default value
                    'stock_count' => $variation["stock_count"],
                ];
            }
            Variation::insert($collection);
        }

        // Attach attributes
        $product->attributes()->attach($request->attributesdata);
     
        // Handle file uploads
        if ($request->hasFile('file')) {
            foreach ($request->file('file') as $file) {
                $product->addMedia($file)->toMediaCollection();
            }
        }

        // Attach shipping rates
        $product->shipping_rates()->attach($request->shipping_rates);

        // Flash success message
        session()->flash('message', 'Product created successfully.');
        return redirect()->route('product.index');
    
    } catch (Exception $e) {
        // Handle exceptions
        session()->flash('error', 'Failed to create product: ' . $e->getMessage());
       
    }
    

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
        $this->authorize('update', $product);

        $attributeNames = $product->attributes->pluck('name');

        $variations = $product->variations->map(function ($variation) {
            $attributes = json_decode($variation->attributes, true);
            if (is_array($attributes)) {
                $attributes = array_map(function ($value) {
                    return is_numeric($value) ? (int)$value : $value; 
                }, $attributes);
            }
            return [
                'id'=> $variation->id,
                'attribute' => $attributes,
                'sale_price' => $variation->sale_price ?? 0,
                'regular_price' => $variation->regular_price ?? 0,
                'sku' => $variation->sku ?? '',
                'status' => $variation->status ?? 'instock',
                'stock_count' => $variation->stock_count ?? 0,
            ];
        });

     
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
        $attribute = Attribute::with('attributeValues')->get();
        $product->load(['categories', 'media']);
       
        return Inertia::render('product/Edit', [
        'categories' => $categories,
        'product' => $product,
        'shippingRates' => $formattedShippingRates,
        'defaultshippingrate' => $defaultshippingrate,
        'attribute' => $attribute,
        'attributeNames' =>$attributeNames,
        'variations' => $variations 
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

        $this->authorize('update', $product);
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
            'variation' => 'nullable|string|max:255',
        ];
       
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $product->update($request->only(['name', 'description', 'price', 'status', 'sku', 'sale_price', 'regular_price', 'tax_class', 'tax', 'stock_count', 'variation']));
        
        $categories = explode(',', $request->categories);
        $categories = array_map('intval', $categories);
        $product->categories()->sync($categories);
        $attributes = json_decode($request->attributesdata);
        $product->attributes()->sync($attributes);

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
        $this->authorize('delete', $product);
        // Delete the product
        $product->delete();

        // Return a response or redirect back with a success message
        return redirect()->back()->with('success', 'Product deleted successfully.');
    }


    //bulkdestroy
    public function bulkdestroy(Request $request)
    {

        $this->authorize('bulkdelete',Product::class);
        $ids = explode(',', $request->ids);
        Product::whereIn('id', $ids)->delete();
        session()->flash('message', 'Product deleted successfully.');
    }
}
