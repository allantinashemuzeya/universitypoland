import { useState, useEffect } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutForm = ({ application, paymentType, amount, currency, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // Create payment intent
            const response = await axios.post(
                route(`student.applications.pay.${paymentType === 'application' ? 'application-fee' : 'commitment-fee'}`, application.id)
            );

            const result = response.data;

            // Confirm payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                result.client_secret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false);
                return;
            }

            // Confirm payment on backend
            const confirmResponse = await axios.post(route('student.payments.confirm'), {
                payment_intent_id: paymentIntent.id,
            });

            const confirmResult = confirmResponse.data;

            setSucceeded(true);
            setProcessing(false);
            
            // Redirect after successful payment
            setTimeout(() => {
                router.visit(route('student.applications.show', application.id), {
                    preserveState: false,
                });
            }, 2000);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            if (err.response) {
                // Server responded with error
                setError(err.response.data.error || err.response.data.message || 'Payment failed');
            } else if (err.request) {
                // Request was made but no response
                setError('Network error. Please check your connection.');
            } else {
                // Something else happened
                setError(err.message || 'An unexpected error occurred');
            }
            setProcessing(false);
        }
    };

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Inter, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Payment Details
                    </h3>
                    <p className="text-gray-600">
                        {paymentType === 'application' ? 'Application' : 'Commitment'} Fee: €{(amount / 100).toFixed(2)}
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Information
                    </label>
                    <div className="border border-gray-300 rounded-md p-3">
                        <CardElement options={cardStyle} />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {succeeded && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-600">
                            Payment successful! Redirecting to your application...
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing || !stripe || succeeded}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                        processing || !stripe || succeeded
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    {processing ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : succeeded ? (
                        'Payment Successful!'
                    ) : (
                        `Pay €${(amount / 100).toFixed(2)}`
                    )}
                </button>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Powered by{' '}
                        <span className="font-semibold">Stripe</span>
                    </p>
                </div>
            </div>
        </form>
    );
};

export default function PaymentPage({ auth, application, paymentType, amount, currency, stripePublicKey }) {
    const [stripePromise, setStripePromise] = useState(null);

    useEffect(() => {
        if (stripePublicKey) {
            setStripePromise(loadStripe(stripePublicKey));
        }
    }, [stripePublicKey]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pay {paymentType === 'application' ? 'Application' : 'Commitment'} Fee
                </h2>
            }
        >
            <Head title={`Pay ${paymentType === 'application' ? 'Application' : 'Commitment'} Fee`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Application Information
                                </h3>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Application Number</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{application.application_number}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Program</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{application.program.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Applicant</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{application.first_name} {application.last_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                application.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                                application.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {application.status.replace('_', ' ').charAt(0).toUpperCase() + application.status.replace('_', ' ').slice(1)}
                                            </span>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {stripePromise && (
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                application={application}
                                paymentType={paymentType}
                                amount={amount}
                                currency={currency}
                            />
                        </Elements>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
