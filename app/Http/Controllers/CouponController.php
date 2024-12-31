<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Coupon::class);
        $coupons = Coupon::where('code','like','%'.$request->search.'%')
        ->orderBy('id','desc')->paginate(50);


        return Inertia::render('coupon/Coupons',compact('coupons'));
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{
    $this->authorize('create', Coupon::class);
    
    $request->validate([
        'code' => 'required|string|unique:coupons,code',
        'type' => 'required|string|in:fixed,percent',
        'value' => 'required|numeric|min:0',
        'usage_type' => 'required|string|in:single,multiple',
        'usage_limit' => 'required_if:usage_type,multiple|nullable|integer|min:1',
        'min_amount' => 'required|numeric',
        'expiry_date' => 'required|date|after:today',
    ]);

    $coupon = new Coupon();
    $coupon->code = $request->input('code');
    $coupon->type = $request->input('type');
    $coupon->value = $request->input('value');
    $coupon->usage_type = $request->input('usage_type');
    $coupon->usage_limit = $request->input('usage_type') === 'multiple' ? $request->input('usage_limit') : 1;
    $coupon->min_amount = $request->input('min_amount');
    $coupon->expiry_date = $request->input('expiry_date');
    $coupon->save();


    return redirect()->back()->with('success', 'Coupon created successfully.');
}

    

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Coupon  $coupon
     * @return \Illuminate\Http\Response
     */
    public function show(Coupon $coupon)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Coupon  $coupon
     * @return \Illuminate\Http\Response
     */
    public function edit(Coupon $coupon)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Coupon  $coupon
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Coupon $coupon)
    {
        $this->authorize('update', $coupon);
        
        $request->validate([
            'code' => 'required|string|unique:coupons,code,' . $coupon->id,
            'type' => 'required|string|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
            'usage_type' => 'required|string|in:single,multiple',
            'usage_limit' => 'required|numeric|min:1',
            'min_amount' => 'required|numeric|min:0',
            'expiry_date' => 'required|date|after:today',
        ]);
    
        $coupon->code = $request->input('code');
        $coupon->type = $request->input('type');
        $coupon->value = $request->input('value');
        $coupon->usage_type = $request->input('usage_type');
        $coupon->usage_limit = $request->usage_type === 'multiple' ? $request->input('usage_limit') : 1;
        $coupon->min_amount = $request->input('min_amount');
        $coupon->expiry_date = $request->input('expiry_date');
        $coupon->save();
    
        return redirect()->back()->with('success', 'Coupon updated successfully.');
    }
    

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Coupon  $coupon
     * @return \Illuminate\Http\Response
     */
    public function destroy(Coupon $coupon)
    {
        $this->authorize('delete', $coupon);
        $coupon->delete();
    
        return redirect()->back()->with('success', 'Coupon deleted successfully.');
    }
    
}
