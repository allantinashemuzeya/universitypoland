<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Stripe\Stripe;

class HealthCheckController extends Controller
{
    public function index()
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'storage' => $this->checkStorage(),
            'stripe' => $this->checkStripe(),
        ];

        $healthy = !in_array(false, $checks);
        $status = $healthy ? 200 : 503;

        return response()->json([
            'status' => $healthy ? 'healthy' : 'unhealthy',
            'timestamp' => now()->toIso8601String(),
            'checks' => $checks,
            'version' => config('app.version', '1.0.0'),
        ], $status);
    }

    private function checkDatabase()
    {
        try {
            DB::select('SELECT 1');
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function checkCache()
    {
        try {
            $key = 'health_check_' . time();
            Cache::put($key, true, 10);
            $result = Cache::get($key) === true;
            Cache::forget($key);
            return $result;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function checkStorage()
    {
        try {
            $path = storage_path('app');
            return is_writable($path);
        } catch (\Exception $e) {
            return false;
        }
    }

    private function checkStripe()
    {
        try {
            Stripe::setApiKey(config('stripe.secret'));
            // Just check if we can set the API key
            // In production, you might want to make a lightweight API call
            return !empty(config('stripe.secret'));
        } catch (\Exception $e) {
            return false;
        }
    }
}