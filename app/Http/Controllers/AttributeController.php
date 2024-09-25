<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Http\Requests\StoreAttributeRequest;
use App\Http\Requests\UpdateAttributeRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        
        $attributes = Attribute::all();

        return Inertia::render('setting/Attribute', compact('attributes'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreAttributeRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreAttributeRequest $request)
{
    

    // Validate request
    $request->validate([
        'name' => 'required|string|max:255|unique:attributes,name',
    ]);

    // Create the attribute
    $attribute = Attribute::create($request->all());

    return redirect()->route('attribute.index')->with('success', 'Attribute created successfully.');
}


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Attribute  $attribute
     * @return \Illuminate\Http\Response
     */
    public function show(Attribute $attribute)
    {
        return response()->json($attribute);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateAttributeRequest  $request
     * @param  \App\Models\Attribute  $attribute
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAttributeRequest $request, $id)
    {
        $attribute = Attribute::findOrFail($id);

    // Validate request
    $request->validate([
        'name' => 'required|string|max:255|unique:attributes,name,' . $id,
    ]);

    // Update the attribute
    $attribute->update($request->all());

    return redirect()->route('attribute.index')->with('success', 'Attribute updated successfully.');
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Attribute  $attribute
     * @return \Illuminate\Http\Response
     */
    public function destroy(Attribute $attribute)
    {
        $attribute->delete();
 
    }
}
