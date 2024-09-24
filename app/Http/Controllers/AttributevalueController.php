<?php

namespace App\Http\Controllers;

use App\Models\Attributevalue;
use App\Http\Requests\StoreAttributevalueRequest;
use App\Http\Requests\UpdateAttributevalueRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttributevalueController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
   
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
     * @param  \App\Http\Requests\StoreAttributevalueRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreAttributevalueRequest $request)
    {
        Attributevalue::create($request->all());

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Attributevalue  $attributevalue
     * @return \Illuminate\Http\Response
     */
    public function show($id )
    {
             $attributevalues = Attributevalue::where('attribute_id', $id)->get();

        return Inertia::render('setting/AttributeValue', compact(['attributevalues', 'id']));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Attributevalue  $attributevalue
     * @return \Illuminate\Http\Response
     */
    public function edit(Attributevalue $attributevalue)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateAttributevalueRequest  $request
     * @param  \App\Models\Attributevalue  $attributevalue
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAttributevalueRequest $request, Attributevalue $attributevalue)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Attributevalue  $attributevalue
     * @return \Illuminate\Http\Response
     */
    public function destroy(Attributevalue $attributevalue)
    {
        Attributevalue::destroy($attributevalue->id);
    }
}
