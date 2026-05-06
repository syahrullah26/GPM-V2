<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuotationRequest extends FormRequest
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
        $quotationId = $this->route('id');

        return [
            'quotation_number' => [
                'required',
                'string',
                Rule::unique('quotations', 'quotation_number')->ignore($quotationId)
            ],
            'customer_id' => 'required|exists:customers,id',
            'date' => 'required|date',
            'status' => 'required|string',

            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:quotation_items,id',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit' => 'nullable|string',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.cost_price' => 'required|numeric|min:0',

        ];
    }
}
