<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Payment;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret'));
    }

    /**
     * Create payment intent for application fee
     */
    public function createApplicationFeeIntent(Request $request, Application $application)
    {
        // Ensure the user owns this application
        if ($application->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to application');
        }

        // Check if application fee is already paid
        if ($application->hasApplicationFeePaid()) {
            return response()->json([
                'error' => 'Application fee has already been paid'
            ], 400);
        }

        try {
            $amount = Setting::get('application_fee_amount', config('stripe.fees.application'));
            $currency = config('stripe.currency');

            // Create payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'metadata' => [
                    'user_id' => Auth::id(),
                    'application_id' => $application->id,
                    'payment_type' => 'application_fee',
                    'application_number' => $application->application_number,
                ],
                'description' => "Application fee for {$application->application_number}",
            ]);

            // Create payment record
            Payment::create([
                'user_id' => Auth::id(),
                'application_id' => $application->id,
                'stripe_payment_intent_id' => $paymentIntent->id,
                'type' => 'application_fee',
                'currency' => $currency,
                'amount' => $amount,
                'status' => 'pending',
                'metadata' => [
                    'application_number' => $application->application_number,
                ],
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
                'amount' => $amount,
                'currency' => $currency,
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe API error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create payment intent'
            ], 500);
        }
    }

    /**
     * Create payment intent for commitment fee
     */
    public function createCommitmentFeeIntent(Request $request, Application $application)
    {
        // Ensure the user owns this application
        if ($application->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to application');
        }

        // Check if application is approved
        if ($application->status !== 'approved') {
            return response()->json([
                'error' => 'Application must be approved before paying commitment fee'
            ], 400);
        }

        // Check if commitment fee is already paid
        if ($application->hasCommitmentFeePaid()) {
            return response()->json([
                'error' => 'Commitment fee has already been paid'
            ], 400);
        }

        try {
            $amount = Setting::get('commitment_fee_amount', config('stripe.fees.commitment'));
            $currency = config('stripe.currency');

            // Create payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'metadata' => [
                    'user_id' => Auth::id(),
                    'application_id' => $application->id,
                    'payment_type' => 'commitment_fee',
                    'application_number' => $application->application_number,
                ],
                'description' => "Commitment fee for {$application->application_number}",
            ]);

            // Create payment record
            Payment::create([
                'user_id' => Auth::id(),
                'application_id' => $application->id,
                'stripe_payment_intent_id' => $paymentIntent->id,
                'type' => 'commitment_fee',
                'currency' => $currency,
                'amount' => $amount,
                'status' => 'pending',
                'metadata' => [
                    'application_number' => $application->application_number,
                ],
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
                'amount' => $amount,
                'currency' => $currency,
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe API error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create payment intent'
            ], 500);
        }
    }

    /**
     * Confirm payment (called after successful payment on frontend)
     */
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        try {
            // Retrieve the payment intent from Stripe
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            // Find the payment record
            $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->firstOrFail();

            // Ensure the user owns this payment
            if ($payment->user_id !== Auth::id()) {
                abort(403, 'Unauthorized access to payment');
            }

            DB::transaction(function () use ($payment, $paymentIntent) {
                // Update payment status
                $payment->update([
                    'status' => $paymentIntent->status,
                    'stripe_charge_id' => $paymentIntent->charges->data[0]->id ?? null,
                    'paid_at' => $paymentIntent->status === 'succeeded' ? now() : null,
                ]);

                // If payment succeeded, update application
                if ($paymentIntent->status === 'succeeded') {
                    $application = $payment->application;
                    
                    if ($payment->isApplicationFee()) {
                        $application->update([
                            'application_fee_paid' => true,
                            'application_fee_paid_at' => now(),
                        ]);
                    } elseif ($payment->isCommitmentFee()) {
                        $application->update([
                            'commitment_fee_paid' => true,
                            'commitment_fee_paid_at' => now(),
                        ]);
                    }
                }
            });

            return response()->json([
                'success' => true,
                'payment' => $payment->load('application'),
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe API error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to confirm payment'
            ], 500);
        } catch (\Exception $e) {
            Log::error('Payment confirmation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to process payment confirmation'
            ], 500);
        }
    }

    /**
     * Show payment page
     */
    public function showPaymentPage(Request $request, Application $application, string $type)
    {
        // Ensure the user owns this application
        if ($application->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to application');
        }

        // Validate payment type
        if (!in_array($type, ['application', 'commitment'])) {
            abort(404);
        }

        $feeType = $type === 'application' ? 'application_fee' : 'commitment_fee';
        $amount = $type === 'application' 
            ? Setting::get('application_fee_amount', config('stripe.fees.application'))
            : Setting::get('commitment_fee_amount', config('stripe.fees.commitment'));

        // Check if fee is already paid
        if ($type === 'application' && $application->hasApplicationFeePaid()) {
            return redirect()->route('student.applications.show', $application)
                ->with('error', 'Application fee has already been paid');
        }

        if ($type === 'commitment' && $application->hasCommitmentFeePaid()) {
            return redirect()->route('student.applications.show', $application)
                ->with('error', 'Commitment fee has already been paid');
        }

        // For commitment fee, check if application is approved
        if ($type === 'commitment' && $application->status !== 'approved') {
            return redirect()->route('student.applications.show', $application)
                ->with('error', 'Application must be approved before paying commitment fee');
        }

        return Inertia::render('Payment/PaymentPage', [
            'application' => $application->load('program'),
            'paymentType' => $type,
            'amount' => $amount,
            'currency' => config('stripe.currency'),
            'stripePublicKey' => config('stripe.key'),
        ]);
    }

    /**
     * Get payment history for an application
     */
    public function getPaymentHistory(Request $request, Application $application)
    {
        // Ensure the user owns this application
        if ($application->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to application');
        }

        $payments = $application->payments()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'payments' => $payments,
        ]);
    }

    /**
     * Download payment receipt
     */
    public function downloadReceipt(Request $request, Payment $payment)
    {
        // Ensure the user owns this payment
        if ($payment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to payment');
        }

        // TODO: Generate PDF receipt
        return response()->json([
            'message' => 'Receipt generation not yet implemented'
        ], 501);
    }
}
