<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', Banner::class);
        
        $poster = Banner::with('media','category','product')->get();
        $products = Product::all();
        $categories = Category::all();
      
        return Inertia::render('setting/Posters',compact(['poster','products','categories']));
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
     * @param  \App\Http\Requests\StoreBannerRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreBannerRequest $request)
    {
        $this->authorize('create', Banner::class);
       
        $banner = Banner::create();
        if($request->file){
            $banner->addMedia($request->file)->toMediaCollection();
        }
        if($request->type == 'product'){
            $banner->update(['product_id' => $request->product]);   
        }
        if($request->type == 'category'){
            $banner->update(['category_id' => $request->category]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Banner  $banner
     * @return \Illuminate\Http\Response
     */
    public function show(Banner $banner)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Banner  $banner
     * @return \Illuminate\Http\Response
     */
    public function edit(Banner $banner)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateBannerRequest  $request
     * @param  \App\Models\Banner  $banner
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateBannerRequest $request, Banner $banner)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Banner  $banner
     * @return \Illuminate\Http\Response
     */
    public function destroy(Banner $banner)
    {
        $this->authorize('delete', $banner);
        $banner->delete();
        return redirect()->back();

    }

    //popup
    public function popup(Banner $banner)
    {
        //set all banner popup to false
        if($banner->popup){
            $banner->update(['popup' => false]);
            session()->flash('message', 'Banner closed');
            return redirect()->back();
        }

        Banner::where('id','!=',$banner->id)->update(['popup' => false]);
        
        $banner->update(['popup' => true]);
        session()->flash('message', 'Banner opened');
        return redirect()->back();

    }

}
