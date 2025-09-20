<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController extends Controller
{
    /**
     * Handle Stripe webhook events
     */
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');
        $webhookSecret = config('stripe.webhook.secret');

        try {
            $event = Webhook::constructEvent($payload, $signature, $webhookSecret);
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe webhook signature verification failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        } catch (\Exception $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Webhook error'], 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'payment_intent.succeeded':
                $this->handlePaymentIntentSucceeded($event->data->object);
                break;

            case 'payment_intent.payment_failed':
                $this->handlePaymentIntentFailed($event->data->object);
                break;

            default:
                Log::info('Unhandled Stripe webhook event type: ' . $event->type);
        }

        return response()->json(['success' => true], 200);
    }

    /**
     * Handle successful payment intent
     */
    private function handlePaymentIntentSucceeded($paymentIntent)
    {
        Log::info('Processing successful payment intent: ' . $paymentIntent->id);

        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if (!$payment) {
            Log::warning('Payment record not found for payment intent: ' . $paymentIntent->id);
            return;
        }

        if ($payment->status === 'succeeded') {
            Log::info('Payment already processed: ' . $payment->id);
            return;
        }

        // Update payment record
        $payment->update([
            'status' => 'succeeded',
            'stripe_charge_id' => $paymentIntent->charges->data[0]->id ?? null,
            'paid_at' => now(),
        ]);

        // Update application based on payment type
        $application = $payment->application;
        
        if ($payment->type === 'application_fee') {
            $application->update([
                'application_fee_paid' => true,
                'application_fee_paid_at' => now(),
            ]);
            Log::info("Application fee marked as paid for application: {$application->application_number}");
        } elseif ($payment->type === 'commitment_fee') {
            $application->update([
                'commitment_fee_paid' => true,
                'commitment_fee_paid_at' => now(),
            ]);
            Log::info("Commitment fee marked as paid for application: {$application->application_number}");
        }

        // TODO: Send payment confirmation email to student
    }

    /**
     * Handle failed payment intent
     */
    private function handlePaymentIntentFailed($paymentIntent)
    {
        Log::warning('Processing failed payment intent: ' . $paymentIntent->id);

        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if (!$payment) {
            Log::warning('Payment record not found for failed payment intent: ' . $paymentIntent->id);
            return;
        }

        $payment->update([
            'status' => 'failed',
            'metadata' => array_merge($payment->metadata ?? [], [
                'failure_reason' => $paymentIntent->last_payment_error->message ?? 'Unknown error',
                'failed_at' => now()->toIso8601String(),
            ]),
        ]);

        // TODO: Send payment failure notification to student
    }
}