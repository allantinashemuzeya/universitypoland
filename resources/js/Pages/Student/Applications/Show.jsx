import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';

export default function ShowApplication({ auth, application }) {
    const { flash } = usePage().props;
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [deleteDocId, setDeleteDocId] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        application_id: application.id,
        file: null,
        type: '',
        description: '',
    });

    const getStatusBadge = (status) => {
        const statusClasses = {
            draft: 'bg-gray-100 text-gray-800',
            submitted: 'bg-blue-100 text-blue-800',
            under_review: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            waitlisted: 'bg-purple-100 text-purple-800',
        };
        
        const statusLabels = {
            draft: 'Draft',
            submitted: 'Submitted',
            under_review: 'Under Review',
            accepted: 'Accepted',
            rejected: 'Rejected',
            waitlisted: 'Waitlisted',
        };
        
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}>
                {statusLabels[status]}
            </span>
        );
    };

    const getDocumentStatusBadge = (status) => {
        if (!status) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Unknown
                </span>
            );
        }
        
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            verified: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const documentTypes = [
        { value: 'passport', label: 'Passport Copy' },
        { value: 'transcript', label: 'Academic Transcript' },
        { value: 'diploma', label: 'Diploma/Certificate' },
        { value: 'language_certificate', label: 'Language Certificate' },
        { value: 'cv', label: 'CV/Resume' },
        { value: 'recommendation_letter', label: 'Recommendation Letter' },
        { value: 'other', label: 'Other' },
    ];

    const handleFileUpload = (e) => {
        e.preventDefault();
        post(route('student.documents.store'), {
            onSuccess: () => {
                reset();
                setUploadModalOpen(false);
                router.reload();
            },
            forceFormData: true,
        });
    };

    const handleDeleteDocument = (documentId) => {
        if (confirm('Are you sure you want to delete this document?')) {
            router.delete(route('student.documents.destroy', documentId), {
                onSuccess: () => router.reload(),
            });
        }
    };

    const handleSubmitApplication = () => {
        if (confirm('Are you sure you want to submit this application? You won\'t be able to edit it after submission.')) {
            router.post(route('student.applications.submit', application.id));
        }
    };

    const requiredDocuments = ['passport', 'transcript', 'diploma'];
    const uploadedTypes = application.documents.map(doc => doc.type);
    const hasAllDocs = requiredDocuments.every(type => uploadedTypes.includes(type));
    const canSubmit = hasAllDocs && application.application_fee_paid;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Application Details</h2>
                    <Link href={route('student.applications.index')} className="text-gray-600 hover:text-gray-900">
                        Back to Applications
                    </Link>
                </div>
            }
        >
            <Head title="Application Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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

                    {/* Application Status */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Application Status</h3>
                                    <div className="flex items-center space-x-4">
                                        {getStatusBadge(application.status)}
                                        {application.submission_date && (
                                            <span className="text-sm text-gray-600">
                                                Submitted on {new Date(application.submission_date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {application.status === 'draft' && (
                                    <div className="space-x-2">
                                        <Link href={route('student.applications.edit', application.id)}>
                                            <PrimaryButton>Edit Application</PrimaryButton>
                                        </Link>
                                        {canSubmit ? (
                                            <PrimaryButton onClick={handleSubmitApplication} className="bg-green-600 hover:bg-green-700">
                                                Submit Application
                                            </PrimaryButton>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                {!hasAllDocs ? 'Upload all required documents to submit' : 'Pay application fee to submit'}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
                            <div className="space-y-4">
                                {/* Application Fee */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Application Fee</h4>
                                        <p className="text-sm text-gray-600">Required to submit your application</p>
                                    </div>
                                    <div className="text-right">
                                        {application.application_fee_paid ? (
                                            <div>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Paid
                                                </span>
                                                {application.application_fee_paid_at && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Paid on {new Date(application.application_fee_paid_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-semibold text-gray-900 mb-2">€50.00</p>
                                                {application.status === 'draft' && hasAllDocs && (
                                                    <Link href={route('student.applications.pay', [application.id, 'application'])}>
                                                        <PrimaryButton className="bg-red-600 hover:bg-red-700">
                                                            Pay Now
                                                        </PrimaryButton>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Commitment Fee */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Commitment Fee</h4>
                                        <p className="text-sm text-gray-600">Required after acceptance to secure your place</p>
                                    </div>
                                    <div className="text-right">
                                        {application.commitment_fee_paid ? (
                                            <div>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Paid
                                                </span>
                                                {application.commitment_fee_paid_at && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Paid on {new Date(application.commitment_fee_paid_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-semibold text-gray-900 mb-2">€200.00</p>
                                                {application.status === 'approved' && (
                                                    <Link href={route('student.applications.pay', [application.id, 'commitment'])}>
                                                        <PrimaryButton className="bg-red-600 hover:bg-red-700">
                                                            Pay Now
                                                        </PrimaryButton>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Application Details */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold mb-4">Program Information</h3>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Program</dt>
                                            <dd className="text-sm text-gray-900">{application.program.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Degree Type</dt>
                                            <dd className="text-sm text-gray-900">{application.program.degree_type}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Duration</dt>
                                            <dd className="text-sm text-gray-900">{application.program.duration_years} years</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
                                            <dd className="text-sm text-gray-900">
                                                {new Date(application.program.application_deadline).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="p-6 bg-white border-b border-gray-200">
                                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                            <dd className="text-sm text-gray-900">{application.first_name} {application.last_name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                            <dd className="text-sm text-gray-900">
                                                {new Date(application.date_of_birth).toLocaleDateString()}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                                            <dd className="text-sm text-gray-900">{application.nationality}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Passport Number</dt>
                                            <dd className="text-sm text-gray-900">{application.passport_number}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="text-sm text-gray-900">{application.email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                            <dd className="text-sm text-gray-900">{application.phone}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                                            <dd className="text-sm text-gray-900">
                                                {application.address}<br />
                                                {application.city}, {application.country} {application.postal_code}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="p-6 bg-white">
                                    <h3 className="text-lg font-semibold mb-4">Educational Background</h3>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Education Level</dt>
                                            <dd className="text-sm text-gray-900">{application.education_level}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Institution</dt>
                                            <dd className="text-sm text-gray-900">{application.institution_name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Graduation Year</dt>
                                            <dd className="text-sm text-gray-900">{application.graduation_year}</dd>
                                        </div>
                                        {application.gpa && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">GPA</dt>
                                                <dd className="text-sm text-gray-900">{application.gpa}</dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">English Proficiency</dt>
                                            <dd className="text-sm text-gray-900">{application.english_proficiency}</dd>
                                        </div>
                                        {application.english_test_score && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Test Score</dt>
                                                <dd className="text-sm text-gray-900">{application.english_test_score}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Documents</h3>
                                        {application.status === 'draft' && (
                                            <button
                                                onClick={() => setUploadModalOpen(true)}
                                                className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
                                            >
                                                Upload Document
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {documentTypes.map(docType => {
                                            const doc = application.documents.find(d => d.type === docType.value);
                                            const isRequired = requiredDocuments.includes(docType.value);
                                            
                                            return (
                                                <div key={docType.value} className="flex items-center justify-between p-2 border rounded">
                                                    <div className="flex items-center space-x-2">
                                                        <div>
                                                            <p className="text-sm font-medium">{docType.label}</p>
                                                            {isRequired && <p className="text-xs text-gray-500">Required</p>}
                                                        </div>
                                                    </div>
                                                    {doc ? (
                                                        <div className="flex items-center space-x-2">
                                                            {getDocumentStatusBadge(doc.verification_status)}
                                                            <a
                                                                href={route('student.documents.show', doc.id)}
                                                                target="_blank"
                                                                className="text-primary-600 hover:text-primary-800 text-sm"
                                                            >
                                                                View
                                                            </a>
                                                            {application.status === 'draft' && (
                                                                <button
                                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">Not uploaded</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Status History */}
                            {application.status_histories && application.status_histories.length > 0 && (
                                <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 bg-white border-b border-gray-200">
                                        <h3 className="text-lg font-semibold mb-4">Status History</h3>
                                        <div className="space-y-3">
                                            {application.status_histories.map((history, index) => (
                                                <div key={index} className="text-sm">
                                                    <p className="font-medium">{history.status}</p>
                                                    {history.notes && <p className="text-gray-600">{history.notes}</p>}
                                                    <p className="text-gray-500 text-xs">
                                                        {new Date(history.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Motivation Letter */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Motivation Letter</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{application.motivation_letter}</p>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dd className="text-sm text-gray-900">{application.emergency_contact_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                    <dd className="text-sm text-gray-900">{application.emergency_contact_phone}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                                    <dd className="text-sm text-gray-900">{application.emergency_contact_relationship}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Communications */}
                    {application.communications && application.communications.length > 0 && (
                        <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-lg font-semibold mb-4">Communications</h3>
                                <div className="space-y-3">
                                    {application.communications.map(comm => (
                                        <div key={comm.id} className="border rounded p-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{comm.subject}</p>
                                                    <p className="text-sm text-gray-600">{comm.message.substring(0, 100)}...</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        From: {comm.sender.name} • {new Date(comm.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route('student.communications.show', comm.id)}
                                                    className="text-primary-600 hover:text-primary-800 text-sm"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Document Modal */}
            <Modal show={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
                <form onSubmit={handleFileUpload} className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Document Type
                        </label>
                        <select
                            className="w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                            value={data.type}
                            onChange={e => setData('type', e.target.value)}
                            required
                        >
                            <option value="">Select type</option>
                            {documentTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            File
                        </label>
                        <input
                            type="file"
                            className="w-full"
                            onChange={e => setData('file', e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Accepted formats: PDF, JPG, PNG (max 10MB)
                        </p>
                        {errors.file && <p className="text-red-600 text-sm mt-1">{errors.file}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (optional)
                        </label>
                        <input
                            type="text"
                            className="w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Additional notes about this document"
                        />
                        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setUploadModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <PrimaryButton disabled={processing}>
                            Upload
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
