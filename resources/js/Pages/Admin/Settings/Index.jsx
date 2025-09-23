import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function SettingsIndex({ auth, settings }) {
    const { data, setData, post, processing, errors } = useForm({
        application_fee_amount: settings.fees.application_fee_amount || 5000,
        commitment_fee_amount: settings.fees.commitment_fee_amount || 35000,
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.fees.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const formatFeeDisplay = (cents) => {
        return `€${(cents / 100).toFixed(2)}`;
    };

    const handleFeeChange = (field, value) => {
        // Remove non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, '');
        setData(field, numericValue ? parseInt(numericValue) : 0);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">System Settings</h2>}
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {showSuccess && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">Settings updated successfully.</span>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Fee Settings</h3>
                            
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="application_fee_amount" value="Application Fee Amount (in cents)" />
                                        
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">€</span>
                                            </div>
                                            <TextInput
                                                id="application_fee_amount"
                                                type="text"
                                                value={data.application_fee_amount}
                                                onChange={(e) => handleFeeChange('application_fee_amount', e.target.value)}
                                                className="pl-7 pr-12 block w-full"
                                                placeholder="5000"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">cents</span>
                                            </div>
                                        </div>
                                        
                                        <p className="mt-1 text-sm text-gray-600">
                                            Display amount: {formatFeeDisplay(data.application_fee_amount)}
                                        </p>
                                        
                                        <InputError message={errors.application_fee_amount} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="commitment_fee_amount" value="Commitment Fee Amount (in cents)" />
                                        
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">€</span>
                                            </div>
                                            <TextInput
                                                id="commitment_fee_amount"
                                                type="text"
                                                value={data.commitment_fee_amount}
                                                onChange={(e) => handleFeeChange('commitment_fee_amount', e.target.value)}
                                                className="pl-7 pr-12 block w-full"
                                                placeholder="35000"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">cents</span>
                                            </div>
                                        </div>
                                        
                                        <p className="mt-1 text-sm text-gray-600">
                                            Display amount: {formatFeeDisplay(data.commitment_fee_amount)}
                                        </p>
                                        
                                        <InputError message={errors.commitment_fee_amount} className="mt-2" />
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                <strong>Note:</strong> Fees are stored in cents. For example, €50.00 should be entered as 5000.
                                                Changes will apply to new applications immediately.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Settings'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Fee Configuration</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-gray-600">Application Fee:</span>
                                    <span className="font-semibold">{formatFeeDisplay(data.application_fee_amount)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Commitment Fee:</span>
                                    <span className="font-semibold">{formatFeeDisplay(data.commitment_fee_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}