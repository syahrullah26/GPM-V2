<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index(): JsonResponse
    {
        try {
            $data = Customer::latest()->paginate(6);
            return response()->json([
                'status'  => true,
                'message' => 'Fetch Customers Successfully',
                'data'    => CustomerResource::collection($data)->response()->getData(true),
            ], 200);
        } catch (\Exception $e) {
            Log::error("Customer Index Error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Internal Server Error'], 500);
        }
    }

    /**
     * Store a newly created customer.
     */
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        try {
            $customer = Customer::create($request->validated());

            return response()->json([
                'status'  => true,
                'message' => 'Add Customer Successfully',
                'data'    => new CustomerResource($customer),
            ], 201);
        } catch (\Exception $e) {
            Log::error("Customer Store Error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Failed to save customer'], 500);
        }
    }

    /**
     * Display the specified customer.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $customer = Customer::with(['orders', 'quotations'])->findOrFail($id);
            return response()->json([
                'status'  => true,
                'message' => "Fetch Customer: {$customer->company_name} Successfully",
                'data'    => new CustomerResource($customer),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => false, 'message' => 'Customer Not Found'], 404);
        } catch (\Exception $e) {
            Log::error("Customer Show Error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Internal Server Error'], 500);
        }
    }

    /**
     * Update the specified customer.
     */
    public function update(StoreCustomerRequest $request, string $id): JsonResponse
    {
        try {
            $customer = Customer::findOrFail($id);
            $customer->update($request->validated());

            return response()->json([
                'status'  => true,
                'message' => "Update Customer: {$customer->company_name} Successfully",
                'data'    => new CustomerResource($customer),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => false, 'message' => 'Customer Not Found'], 404);
        } catch (\Exception $e) {
            Log::error("Customer Update Error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Update Failed'], 500);
        }
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $customer = Customer::findOrFail($id);
            $name = $customer->company_name;
            $customer->delete();

            return response()->json([
                'status'  => true,
                'message' => "Delete Customer: {$name} Successfully",
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => false, 'message' => 'Customer Not Found'], 404);
        } catch (\Exception $e) {
            Log::error("Customer Delete Error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Delete Failed'], 500);
        }
    }
}
