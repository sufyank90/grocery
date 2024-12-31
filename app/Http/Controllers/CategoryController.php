<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request; // Correct import statement
use Illuminate\Support\Facades\Gate; 

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    
    public function index(Request $request)
    {
        $this->authorize('viewAny', Category::class);
        $categorys = Category::where('name','like','%'.$request->search.'%')
        ->orderBy('id','desc')->with('media')->paginate(50);

        $createPolicy = Gate::allows('create', Category::class);
        $updatePolicy = Gate::allows('update', Category::class);

        return Inertia::render('category/Category', compact('categorys','createPolicy','updatePolicy'));
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
     * @param  \App\Http\Requests\StoreCategoryRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('create', Category::class);
        $exist = Category::where('name', $request->name)->first();
        if ($exist) {
            session()->flash('error', 'Category already exist');
            return back();
        }
        
        $data = $request->except(['file']);
        $category = Category::create($data);
        if($request->file){
            $category->addMedia($request->file)->toMediaCollection();
        }
        return back();
    }
    
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateCategoryRequest  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
    
    }

    public function updatewithfile(Request $request, Category $category)
    {

        $this->authorize('update', Category::class);
        $rules = [
            'name' => 'required|string|max:255',
        ];

        // Validate the request
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Update the Category
        $category->update($request->only(['name']));

        if ($request->hasFile('file')) {
            $category->clearMediaCollection();
            $category->addMedia($request->file('file'))->toMediaCollection();
        }

        // Redirect back with a success message
        return redirect()->back()->with('success', 'Category updated successfully.');
    }



    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);
        $category->delete();
        return redirect()->back()->with('success', 'Category deleted successfully.');
    }

    //bulkdestroy
    public function bulkdestroy(Request $request)
    {

        $this->authorize('bulkdelete', Category::class);
        $ids = explode(',', $request->ids);
        Category::whereIn('id', $ids)->delete();
       session()->flash('message', 'Category deleted successfully.');
    }

}
