<?php

namespace App\Http\Controllers;

use App\Models\ShippingRate;
use App\Http\Requests\StoreShippingRateRequest;
use App\Http\Requests\UpdateShippingRateRequest;
use Illuminate\Http\Request; // Correct import statement
use Inertia\Inertia;

class ShippingRateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if($request->search)
        {
            $shipments = ShippingRate::where('area_name','like','%'.$request->search.'%')->paginate(10);
        }
        else
        {
            $shipments = ShippingRate::paginate(10);
        }
        return Inertia::render('shipment/Index', compact('shipments'));
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
     * @param  \App\Http\Requests\StoreShippingRateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function storeCreate(Request $request)
{
   
    // Validate incoming request
    $request->validate([
        'country_name' => 'required|string',
        'state_name' => 'required|string',
        'city_name' => 'required|string',
        'area_name' => 'required|string',
        'fees' => 'required|numeric',
        'postal_code' => 'nullable|string',
        'minimum' => 'nullable|numeric',
        'min_for_free_delivery' => 'nullable|numeric',
        // Add other validation rules as needed
    ]);

    // Create new shipping rate
    $shippingRate = new ShippingRate();
    $shippingRate->country_id = $request->country_id;
    $shippingRate->country_name = $request->country_name;
    $shippingRate->state_id = $request->state_id;
    $shippingRate->state_name = $request->state_name;
    $shippingRate->city_id = $request->city_id;
    $shippingRate->city_name = $request->city_name;
    $shippingRate->area_id = $request->area_id;
    $shippingRate->area_name = $request->area_name;
    $shippingRate->postal_code = $request->postal_code;
    $shippingRate->fee = $request->fees;
    $shippingRate->minimum = $request->minimum;
    $shippingRate->min_for_free_delivery = $request->min_for_free_delivery;
    $shippingRate->weight_charges = $request->weight_charges;
    $shippingRate->additional_weight_charges = $request->additional_weight_charges;
    $shippingRate->delivery_estimation = $request->delivery_estimation;
    $shippingRate->sequence = $request->sequence;
    $shippingRate->date_created = now();
    $shippingRate->date_modified = now();
    $shippingRate->ip_address = $request->ip(); // Get the user's IP address

    // Save the shipping rate
    $shippingRate->save();

    return redirect()->back()->with('success', 'Shipping rate created successfully.');
}


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ShippingRate  $shippingRate
     * @return \Illuminate\Http\Response
     */
    public function show(ShippingRate $shippingRate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ShippingRate  $shippingRate
     * @return \Illuminate\Http\Response
     */
    public function edit(ShippingRate $shippingRate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateShippingRateRequest  $request
     * @param  \App\Models\ShippingRate  $shippingRate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $shippingRate)
    {
        $shippingRate = ShippingRate::find($shippingRate);
        //dd($shippingRate);
        $shippingRate->fee = $request->fees;
        $shippingRate->save();
        return redirect()->back()->with('success', 'Shipping rate updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ShippingRate  $shippingRate
     * @return \Illuminate\Http\Response
     */
    public function destroy(ShippingRate $shippingRate)
    {
        //
    }
}
