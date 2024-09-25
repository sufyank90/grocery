<?php

namespace App\Http\Controllers;

use App\Models\Variation;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVariationRequest;
use App\Http\Requests\UpdateVariationRequest;

class VariationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreVariationRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreVariationRequest $request)
    {
        // 
       
        $variation =   Variation::create([
        'attributes'=> json_encode($request->attribute),
        "sale_price" => $request->sale_price,
        "regular_price" => $request->regular_price,
        "sku" => $request->sku,
        "status" =>$request->status,
        "stock_count" => $request->stock_count,
        "product_id" => $request->product_id
       ]);


       $attributes = json_decode($request->attributesdata);

       $product = $variation->product;
       

       $product->attributes()->sync($attributes);

 
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Variation  $variation
     * @return \Illuminate\Http\Response
     */
    public function show(Variation $variation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Variation  $variation
     * @return \Illuminate\Http\Response
     */
    public function edit(Variation $variation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateVariationRequest  $request
     * @param  \App\Models\Variation  $variation
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateVariationRequest $request, Variation $variation)
    {
        $variation->update([
            'attributes'=>$request->attribute,
            "sale_price" => $request->sale_price,
            "regular_price" => $request->regular_price,
            "sku" => $request->sku,
            "status" =>$request->status,
            "stock_count" => $request->stock_count,
        ]);

        $attributes = json_decode($request->attributesdata);

        $product = $variation->product;


        $product->attributes()->sync($attributes);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Variation  $variation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Variation $variation)
    {
        $variation->delete();
        
    }
}
