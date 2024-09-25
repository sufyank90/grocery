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
        // Validate that the combination of value and attribute_id is unique
    $request->validate([
        'value' => 'required|string',
        'attribute_id' => 'required|integer',
        // Ensure value is unique for the given attribute_id
        'value' => 'unique:attributevalues,value,NULL,id,attribute_id,' . $request->attribute_id,
    ], [
        'value.unique' => 'The attribute value name has already been taken for this attribute.',
        'value.required' => 'Attribute value is required.',
        'attribute_id.required' => 'Attribute ID is required.',
        'attribute_id.integer' => 'Attribute ID must be an integer.',
    ]);

    // If validation passes, create the new attribute value
    Attributevalue::create($request->all());

    // Optionally return a response or redirect
    return redirect()->back()->with('success', 'Attribute value created successfully.');

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
