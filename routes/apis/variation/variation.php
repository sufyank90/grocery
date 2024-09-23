<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Product;
//Attributevalue
use App\Models\Attributevalue;

Route::middleware('auth:sanctum')->prefix('product')->group(function () {

    Route::get('/variation/{id}', function (Request $request, $id) {
        $product = Product::with('variations')->find($id);

        $attributeNames = $product->attributes;

        $variations = $attributeNames->map(function ($att) {
            return [
                'name' => $att->name,
                'id' => $att->id,
                'option' => Attributevalue::where('attribute_id', $att->id)->get()->map(function ($value) use ($att) {
                    return [
                        'value' => $value->value,
                        'id' => $value->id,
                    ];
                }),
            ];
        });
        
        return response()->json([
            'data' => $product,
            'variations' => $variations,
        ]);
    });

});
