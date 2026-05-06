<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\DeliveryNoteResource;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): jsonResponse
    {
        try {
            $data = Order::latest()->with(['orderItems', 'customers:id,company_name', 'invoices'])->paginate(10);
            return response()->json([
                'status' => true,
                'message' => 'fetch orders successfully',
                'data' => OrderResource::collection($data)->response()->getData(true),
            ], 200);
        } catch (\Exception $e) {
            Log::error("Order Index Error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'internal server error :' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        return DB::transaction(function () use ($request) {
            try {
                $validate = $request->validated();
                $order = Order::create([
                    'order_number' => $validate['order_number'],
                    'quotation_id' => $validate['quotation_id'] ?? null,
                    'customer_id'  => $validate['customer_id'],
                    'order_date' => $validate['order_date'],
                    'status'       => 'pending',
                ]);
                $dueDate = date('Y-m-d', strtotime('+30 days', strtotime($validate['order_date'])));
                $subtotal = 0;
                foreach ($validate['items'] as $item) {
                    $subtotal += $item['quantity'] * $item['selling_price'];

                    $order->orderItems()->create([
                        'item_name'     => $item['item_name'],
                        'quantity'      => $item['quantity'],
                        'unit'          => $item['unit'] ?? null,
                        'selling_price' => $item['selling_price'],
                        'cost_price'    => $item['cost_price'],
                    ]);
                }

                $rawInvoiceNumber = $validate['invoice_number'] ?? strtoupper(uniqid());
                $nowYear = date('y');
                $taxRate = $validate['is_taxable'] ? 11 : 0;
                $taxAmount = ($subtotal * $taxRate) / 100;
                $grandTotal = $subtotal + $taxAmount;

                $order->invoices()->create([
                    'invoice_number' => $rawInvoiceNumber . '/INV/GPM/' . $nowYear,
                    'subtotal'       => $subtotal,
                    'is_taxable'     => $validate['is_taxable'],
                    'tax_rate'       => $taxRate,
                    'tax_amount'     => $taxAmount,
                    'grand_total'    => $grandTotal,
                    'due_date'       => $dueDate,
                    'status'         => 'unpaid',
                ]);

                return response()->json([
                    'status'  => true,
                    'message' => 'Create order and invoice successfully',
                    'data'    => new OrderResource($order->load(['orderItems', 'invoices', 'customers'])),
                ], 201);
            } catch (\Exception $e) {
                Log::error("Order Store Error: " . $e->getMessage());
                return response()->json([
                    'status'  => false,
                    'message' => 'Internal server error: ' . $e->getMessage(),
                ], 500);
            }
        });
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        return DB::transaction(function () use ($request, $id) {
            try {
                $request->validate([
                    'order_status'   => 'string|in:pending,done',
                    'invoice_status' => 'string|in:unpaid,paid',
                ]);
                $order = Order::findOrFail($id);
                if ($order->status === 'done' && $order->invoices->status === 'paid') {
                    return response()->json([
                        'status'  => false,
                        'message' => 'this order already done.',
                    ], 400);
                }
                $statusOrder   = $request->get('order_status', 'done');
                $statusInvoice = $request->get('invoice_status', 'paid');
                $order->update([
                    'status' => $statusOrder,
                ]);
                $order->invoices()->update([
                    'status' => $statusInvoice
                ]);

                return response()->json([
                    'status'  => true,
                    'message' => "Order status updated to {$statusOrder} and Invoice to {$statusInvoice}",
                    'data'    => new OrderResource($order->load(['orderItems', 'invoices', 'customers'])),
                ], 200);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Order not found',
                ], 404);
            } catch (\Exception $e) {
                Log::error("Order Update Status Error: " . $e->getMessage());
                return response()->json([
                    'status'  => false,
                    'message' => 'Internal server error: ' . $e->getMessage(),
                ], 500);
            }
        });
    }


    public function generateDeliveryNote(Request $request, string $id): JsonResponse
    {
        return DB::transaction(function () use ($request, $id) {
            try {
                $validated = $request->validate([
                    'delivery_number' => 'required|string',
                    'shipping_date'   => 'required|date',
                ]);
                $order = Order::findOrFail($id);
                $deliveryNumberFormat = $validated['delivery_number'] . '/SJ/GPM/' . date('y');

                $deliveryNote = $order->deliveryNote()->create([
                    'delivery_number' => $deliveryNumberFormat,
                    'shipping_date'   => $validated['shipping_date'],
                ]);

                return response()->json([
                    'status'  => true,
                    'message' => 'Delivery Note generated successfully',
                    'data'    => new DeliveryNoteResource($deliveryNote->load(['orders', 'orders.orderItems', 'orders.invoices', 'orders.customers'])),
                ], 201);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Order Not Found'
                ], 404);
            } catch (\Exception $e) {
                Log::error("Order Generate Delivery Note Error: " . $e->getMessage());
                return response()->json([
                    'status'  => false,
                    'message' => 'Internal server error: ' . $e->getMessage(),
                ], 500);
            }
        });
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $order = Order::with(['orderItems', 'invoices', 'customers:id,company_name'])->findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => 'fetch order : ' . $order->order_number .  ' successfully',
                'data' => new OrderResource($order),
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Order Not Found',

            ], 404);
        } catch (\Exception $e) {
            Log::error("Order Show Error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'internal server error :' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, string $id): JsonResponse
    {
        return DB::transaction(function () use ($request, $id) {
            try {
                $order = Order::findOrFail($id);
                $validated = $request->validated();

                $order->update([
                    'order_number' => $validated['order_number'],
                    'quotation_id' => $validated['quotation_id'] ?? $order->quotation_id,
                    'customer_id'  => $validated['customer_id'],
                    'order_date'   => $validated['order_date'],
                    'status'       => $validated['status'],
                ]);

                $order->orderItems()->delete();
                $subtotal = 0;
                foreach ($validated['items'] as $item) {
                    $subtotal += $item['quantity'] * $item['selling_price'];
                    $order->orderItems()->create([
                        'item_name'     => $item['item_name'],
                        'quantity'      => $item['quantity'],
                        'unit'          => $item['unit'] ?? null,
                        'selling_price' => $item['selling_price'],
                        'cost_price'    => $item['cost_price'],
                    ]);
                }

                $taxRate = $validated['is_taxable'] ? 11 : 0;
                $taxAmount = ($subtotal * $taxRate) / 100;
                $grandTotal = $subtotal + $taxAmount;

                $order->invoices()->update([
                    'invoice_number' => $validated['invoice_number'] ?? $order->invoices->invoice_number,
                    'subtotal'       => $subtotal,
                    'is_taxable'     => $validated['is_taxable'],
                    'tax_rate'       => $taxRate,
                    'tax_amount'     => $taxAmount,
                    'grand_total'    => $grandTotal,
                ]);

                return response()->json([
                    'status'  => true,
                    'message' => 'Order, Items, and Invoice updated successfully',
                    'data'    => new OrderResource($order->load(['orderItems', 'invoices', 'customers'])),
                ], 200);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Order Not Found',
                ], 404);
            } catch (\Exception $e) {
                Log::error("Order Update Error: " . $e->getMessage());
                return response()->json([
                    'status'  => false,
                    'message' => 'Internal Server Error: ' . $e->getMessage(),
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
            $order = Order::findOrFail($id);

            if ($order->invoices && $order->invoices->status === 'paid') {
                return response()->json([
                    'status'  => false,
                    'message' => 'Order yang sudah dibayar tidak boleh dihapus!'
                ], 403);
            }

            $order->delete();

            return response()->json([
                'status'  => true,
                'message' => 'Order dan data terkait berhasil dihapus.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal menghapus order: ' . $e->getMessage()
            ], 500);
        }
    }
}
