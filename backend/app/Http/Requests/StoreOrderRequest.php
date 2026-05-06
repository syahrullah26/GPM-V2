<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_number' => 'required|string|unique:orders,order_number',
            'quotation_id' => 'nullable|exists:quotations,id',
            'customer_id'  => 'required|exists:customers,id',
            'order_date'         => 'required|date',
            'status'       => 'required|string',

            // Order item validation
            'items'                  => 'required|array|min:1',
            'items.*.item_name'      => 'required|string|max:255',
            'items.*.quantity'       => 'required|integer|min:1',
            'items.*.unit'           => 'nullable|string',
            'items.*.selling_price'  => 'required|numeric|min:0',
            'items.*.cost_price'     => 'required|numeric|min:0',

            // Invoices validation
            'invoice_number' => 'nullable|string|unique:invoices,invoice_number',
            'is_taxable'     => 'required|boolean',
        ];
    }
}
