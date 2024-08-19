<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'items' => 'required|array|min:1',
            'coupon' => 'nullable|array',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'zipcode' => 'required|string|max:10',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'method' => 'required|in:cash,card',
            'total' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric',
            'couponcode' => 'nullable|string|max:50',
            'coupontype' => 'nullable|in:fixed,percentage',
            'payable' => 'required|numeric',
            'status' => 'required',
            'user_id' => 'required',
        ];
    }
}
