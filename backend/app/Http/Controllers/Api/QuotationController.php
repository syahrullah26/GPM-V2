<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuotationRequest;
use App\Http\Resources\QuotationResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\http\JsonResponse;
use App\Models\Quotation;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\UpdateQuotationRequest;
use App\Models\Order;

class QuotationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $data = Quotation::latest()->with('customers:id,company_name,address', 'quotationItems')->paginate(10);
            return response()->json([
                'status' => true,
                'message' => 'Fetch Quotations Successfully',
                'data' => QuotationResource::collection($data)->response()->getData(true),
            ], 200);
        } catch (\Exception $e) {
            Log::error("Quotation Index Error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuotationRequest $request): JsonResponse
    {
        return DB::transaction(function ()  use ($request,) {
            try {
                $validate = $request->validated();
                $nowYear = date('y');
                $quotation = Quotation::create([
                    'quotation_number' => $validate['quotation_number'] . '/PNW/GPM' . $nowYear,
                    'customer_id' => $validate['customer_id'],
                    'date' => $validate['date'],
                    'status' => 'pending',
                ]);

                foreach ($validate['items'] as $item) {

                    $quotation->quotationItems()->create([
                        'item_name' => $item['item_name'],
                        'quantity' => $item['quantity'],
                        'unit' => $item['unit'] ?? null,
                        'price' => $item['price'],
                        'cost_price' => $item['cost_price'],
                    ]);
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Create Quotation Successfully',
                    'data' => new QuotationResource($quotation),
                ], 201);
            } catch (ValidationException $e) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $e->errors()
                ], 422);
            } catch (\Exception $e) {
                Log::error("Create Quotation Error: " . $e->getMessage());
                return response()->json([
                    'status' => false,
                    'message' => 'Internal Server Error' . $e->getMessage(),
                ], 500);
            }
        });
    }


    public function rejectStatus(Request $request, string $id): JsonResponse
    {

        return DB::transaction(function () use ($request, $id) {
            try {
                $validated = $request->validate([
                    'status' => 'required|string|in:rejected',
                ]);

                $quotation = Quotation::findOrFail($id);
                $quotation->update(['status' => $validated['status']]);

                return response()->json([
                    'status' => true,
                    'message' => 'Quotation Rejected Successfully',
                    'data' => new QuotationResource($quotation->load(['quotationItems', 'customers:id,company_name,address'])),
                ]);
            } catch (ModelNotFoundException $e) {
                return response()->json(['status' => false, 'message' => 'Quotation Not Found'], 404);
            } catch (\Exception $e) {
                Log::error('Quotation Reject Error: ' . $e->getMessage());
                return response()->json(['status' => false, 'message' => 'Internal Server Error'], 500);
            }
        });
    }

    public function approveStatus(Request $request, string $id): JsonResponse
    {
        return DB::transaction(function () use ($request, $id) {
            try {
                $validated = $request->validate([
                    'status'         => 'required|string|in:approved',
                    'invoice_number' => 'required|string|unique:invoices,invoice_number',
                    'is_taxable'     => 'required|boolean',
                ]);

                $quotation = Quotation::with('quotationItems')->findOrFail($id);


                $quotation->update(['status' => $validated['status']]);
                $year = date('y');
                $lastOrder = Order::whereYear('created_at', date('Y'))
                    ->orderBy('id', 'desc')
                    ->first();
                if ($lastOrder) {
                    $lastNumber = (int) substr($lastOrder->order_number, 0, 3);
                    $nextNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
                } else {
                    $nextNumber = '001';
                }
                $generatedOrderNumber = "{$nextNumber}/ORD/GPM/{$year}";
                $subtotal = 0;
                $order_date = now();
                $order = $quotation->orders()->create([
                    'order_number' => $generatedOrderNumber,
                    'customer_id'  => $quotation->customer_id,
                    'order_date'   => $order_date,
                    'status'       => 'pending',
                ]);

                foreach ($quotation->quotationItems as $item) {
                    $subtotal += $item->quantity * $item->price;
                    $order->orderItems()->create([
                        'item_name'     => $item->item_name,
                        'quantity'      => $item->quantity,
                        'unit'          => $item->unit,
                        'selling_price' => $item->price,
                        'cost_price'    => $item->cost_price,
                    ]);
                }
                $rawInvoiceNumber = $validated['invoice_number'] ?? strtoupper(uniqid());
                $nowYear = date('Y');
                $dueDate = date('Y-m-d', strtotime('+30 days'));
                $taxRate = $validated['is_taxable'] ? 11 : 0;
                $taxAmount = ($subtotal * $taxRate) / 100;
                $grandTotal = $subtotal + $taxAmount;

                $order->invoices()->create([
                    'invoice_number' => $rawInvoiceNumber . '/INV/GPM/' . $nowYear,
                    'subtotal' => $subtotal,
                    'is_taxable'     => $validated['is_taxable'],
                    'tax_rate' => $taxRate,
                    'tax_amount' => $taxAmount,
                    'grand_total' => $grandTotal,
                    'due_date' => $dueDate,
                    'status'         => 'unpaid',
                ]);

                return response()->json([
                    'status' => true,
                    'message' => 'Quotation Approved and Order Created Successfully',
                    'data' => new QuotationResource($quotation->load(['orders.orderItems', 'customers'])),
                ]);
            } catch (ModelNotFoundException $e) {
                return response()->json(['status' => false, 'message' => 'Quotation Not Found'], 404);
            } catch (\Exception $e) {
                Log::error('Quotation Approve Error: ' . $e->getMessage());
                return response()->json(['status' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
            }
        });
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $quotation = Quotation::with(['customers:id,company_name,address', 'quotationItems'])->findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => 'Fetch Quotation : ' . $quotation->quotation_number . ' Successfully',
                'data' => new QuotationResource($quotation),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Quotation Not Found'
            ], 404);
        } catch (\Exception $e) {
            Log::error("Quotation Show Error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuotationRequest $request, string $id)
    {
        return DB::transaction(function () use ($request, $id) {

            try {
                $quotation = Quotation::findOrFail($id);
                $validated = $request->validated();
                $quotation->update([
                    'quotation_number' => $validated['quotation_number'],
                    'customer_id' => $validated['customer_id'],
                    'date' => $validated['date'],
                    'status' => $validated['status'],
                ]);

                $quotation->quotationItems()->delete();

                foreach ($validated['items'] as $item) {
                    $quotation->quotationItems()->create([
                        'item_name' => $item['item_name'],
                        'quantity' => $item['quantity'],
                        'unit' => $item['unit'] ?? null,
                        'selling_price' => $item['selling_price'],
                        'cost_price' => $item['cost_price'],
                    ]);
                }
                return response()->json([
                    'status' => true,
                    'message' => "Update Quotation : {$quotation->quotation_number} Successfully",
                    'data' => new QuotationResource($quotation),
                ], 200);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'status' => false,
                    'message' => 'Quotation Not Found',

                ], 404);
            } catch (\Exception $e) {
                Log::error("Quotation Update Error: " . $e->getMessage());
                return response()->json([
                    'status' => false,
                    'message' => 'Update Failed'
                ], 500);
            }
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $quotation = Quotation::findOrFail($id);
            $quotationNumber = $quotation->quotation_number;

            if ($quotation->status !== 'pending') {
                return response()->json([
                    'status' => false,
                    'message' => 'Quotation cannot be deleted because quotation already processed'
                ], 400);
            }
            $quotation->delete();
            return response()->json([
                'status' => true,
                'message' => "Delete Quotation : {$quotationNumber} Successfully"

            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Quotation Not Found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Quotation Delete Error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Delete Failed'
            ], 500);
        }
    }
}
