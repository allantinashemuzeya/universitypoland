import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
// route function is available globally through @routes directive

export default function Pending({ auth, documents }) {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [reviewNotes, setReviewNotes] = useState('');
    const [processingId, setProcessingId] = useState(null);

    const handleStatusUpdate = (document, status) => {
        setProcessingId(document.id);
        
        router.post(route('admin.documents.updateStatus', document.id), {
            status,
            review_notes: reviewNotes,
        }, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                setSelectedStatus('');
                setReviewNotes('');
                setProcessingId(null);
            },
            onFinish: () => {
                setProcessingId(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pending Documents</h2>}
        >
            <Head title="Pending Documents" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {documents.data.length === 0 ? (
                                <p className="text-gray-500">No pending documents to review.</p>
                            ) : (
                                <div className="space-y-6">
                                    {documents.data.map((document) => (
                                        <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {document.type.charAt(0).toUpperCase() + document.type.slice(1).replace('_', ' ')}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Application: #{document.application.application_number}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Student: {document.application.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Uploaded: {new Date(document.created_at).toLocaleDateString()}
                                                    </p>
                                                    {document.description && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            Description: {document.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <a
                                                            href={route('admin.documents.download', document.id)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                        >
                                                            Download Document
                                                        </a>
                                                    </div>
                                                    
                                                    <div>
                                                        <label htmlFor={`notes-${document.id}`} className="block text-sm font-medium text-gray-700">
                                                            Review Notes (Optional)
                                                        </label>
                                                        <textarea
                                                            id={`notes-${document.id}`}
                                                            rows={2}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                            value={reviewNotes}
                                                            onChange={(e) => setReviewNotes(e.target.value)}
                                                            placeholder="Add any notes about this document..."
                                                        />
                                                    </div>
                                                    
                                                    <div className="flex space-x-2">
                                                        <PrimaryButton
                                                            onClick={() => handleStatusUpdate(document, 'verified')}
                                                            disabled={processingId === document.id}
                                                        >
                                                            {processingId === document.id ? 'Processing...' : 'Approve'}
                                                        </PrimaryButton>
                                                        <SecondaryButton
                                                            onClick={() => handleStatusUpdate(document, 'rejected')}
                                                            disabled={processingId === document.id}
                                                        >
                                                            Reject
                                                        </SecondaryButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {documents.links && documents.links.length > 3 && (
                                <div className="mt-6">
                                    {/* Pagination would go here */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
