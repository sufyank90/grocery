<?php

namespace App\Http\Controllers;

use App\Models\ShippingRate;
use App\Http\Requests\StoreShippingRateRequest;
use App\Http\Requests\UpdateShippingRateRequest;
use Illuminate\Http\Request; // Correct import statement
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate; 

class ShippingRateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', ShippingRate::class);
        if($request->search)
        {
            $shipments = ShippingRate::where('area_name','like','%'.$request->search.'%')->paginate(10);
        }
        else
        {
            $shipments = ShippingRate::orderBy('id','desc')->paginate(10);
        }

        $createPolicy = Gate::allows('create', ShippingRate::class);

        return Inertia::render('shipment/Index', compact('shipments','createPolicy'));
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
    public function store(Request $request)
    {   // Create new shipping rate
        $this->authorize('create', ShippingRate::class);
        ShippingRate::create($request->all());
        session()->flash('message', 'Shipping rate created successfully.');

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
        $this->authorize('update', $shippingRate);
        //dd($shippingRate);
        $shippingRate->fee = $request->fees;
        $shippingRate->save();
        session()->flash('message', 'Shipping rate updated successfully.');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ShippingRate  $shippingRate
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {  
        $shippingRate = ShippingRate::find($id);
        $this->authorize('delete', $shippingRate);
        $shippingRate->delete();
        session()->flash('message', 'Shipping rate deleted successfully.');
    }

    
    public function bulkdestroy(Request $request)
    {

        $this->authorize('bulkdelete', ShippingRate::class);
        $ids = explode(',', $request->ids);
        ShippingRate::whereIn('id', $ids)->delete();
       session()->flash('message', 'Shipping rate deleted successfully.');
    }
}
