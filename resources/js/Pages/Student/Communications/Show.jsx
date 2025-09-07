import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ShowCommunication({ auth, communication }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        message: '',
    });

    const handleReply = (e) => {
        e.preventDefault();
        post(route('student.communications.reply', communication.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Communication Details</h2>
                    <Link
                        href={route('student.applications.show', communication.application_id)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Back to Application
                    </Link>
                </div>
            }
        >
            <Head title="Communication Details" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {flash.success}
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {flash.error}
                        </div>
                    )}

                    {/* Communication Details */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">{communication.subject}</h3>
                                <div className="text-sm text-gray-600 space-x-4">
                                    <span>From: <strong>{communication.sender.name}</strong></span>
                                    <span>Date: <strong>{new Date(communication.created_at).toLocaleString()}</strong></span>
                                    {communication.type && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            {communication.type}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <p className="whitespace-pre-wrap text-gray-800">{communication.message}</p>
                            </div>

                            {/* Application Context */}
                            {communication.application && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Related Application</h4>
                                    <div className="text-sm text-gray-600">
                                        <p>Program: {communication.application.program.name}</p>
                                        <p>Status: {communication.application.status}</p>
                                        <Link
                                            href={route('student.applications.show', communication.application.id)}
                                            className="text-primary-600 hover:text-primary-800 mt-1 inline-block"
                                        >
                                            View Application →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reply Form */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Send Reply</h3>
                            
                            <form onSubmit={handleReply}>
                                <div className="mb-4">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="6"
                                        className="w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        placeholder="Type your reply here..."
                                        required
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <PrimaryButton disabled={processing}>
                                        Send Reply
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Previous Messages in Thread */}
                    {communication.parent_id && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Previous Messages</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">This is part of an ongoing conversation.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
