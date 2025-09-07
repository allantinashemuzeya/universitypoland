import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
// route function is available globally through @routes directive

export default function Show({ auth, application }) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);

    const statusForm = useForm({
        status: application.status,
        notes: '',
    });

    const noteForm = useForm({
        note: '',
    });

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        statusForm.post(route('admin.applications.updateStatus', application.id), {
            onSuccess: () => {
                setShowStatusModal(false);
                statusForm.reset('notes');
            },
        });
    };

    const handleAddNote = (e) => {
        e.preventDefault();
        noteForm.post(route('admin.applications.addNote', application.id), {
            onSuccess: () => {
                setShowNoteModal(false);
                noteForm.reset();
            },
        });
    };

    const statusColors = {
        draft: 'bg-gray-100 text-gray-800',
        submitted: 'bg-blue-100 text-blue-800',
        under_review: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        waitlisted: 'bg-purple-100 text-purple-800',
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Application #{application.application_number}
                    </h2>
                    <Link
                        href={route('admin.applications.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Back to Applications
                    </Link>
                </div>
            }
        >
            <Head title={`Application ${application.application_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Status and Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
                                    <span className={`mt-2 px-3 inline-flex text-sm leading-6 font-semibold rounded-full ${statusColors[application.status]}`}>
                                        {application.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="space-x-3">
                                    <PrimaryButton onClick={() => setShowStatusModal(true)}>
                                        Update Status
                                    </PrimaryButton>
                                    <SecondaryButton onClick={() => setShowNoteModal(true)}>
                                        Add Note
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {application.first_name} {application.last_name}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{application.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{application.phone}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(application.date_of_birth).toLocaleDateString()}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{application.nationality}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Passport Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{application.passport_number}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Program Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Information</h3>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Program</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{application.program.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Degree Type</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{application.program.degree_type}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {application.submission_date 
                                            ? new Date(application.submission_date).toLocaleDateString()
                                            : 'Not submitted'
                                        }
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                            {application.documents.length === 0 ? (
                                <p className="text-gray-500">No documents uploaded.</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {application.documents.map((document) => (
                                        <li key={document.id} className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {document.type.charAt(0).toUpperCase() + document.type.slice(1).replace('_', ' ')}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Uploaded: {new Date(document.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        document.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                        document.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {document.status}
                                                    </span>
                                                    <a
                                                        href={route('admin.documents.download', document.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Status History */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                            {application.status_histories && application.status_histories.length > 0 ? (
                                <ul className="space-y-4">
                                    {application.status_histories.map((history) => (
                                        <li key={history.id} className="border-l-2 border-gray-200 pl-4">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">{history.changed_by.name}</span>
                                                <span className="mx-2">•</span>
                                                <span>{new Date(history.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-900 mt-1">
                                                Changed from <strong>{history.from_status}</strong> to <strong>{history.to_status}</strong>
                                            </p>
                                            {history.comment && (
                                                <p className="text-sm text-gray-600 mt-1">{history.comment}</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No status history available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Update Application Status</h3>
                        <form onSubmit={handleStatusUpdate}>
                            <div className="mb-4">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    New Status
                                </label>
                                <select
                                    id="status"
                                    value={statusForm.data.status}
                                    onChange={(e) => statusForm.setData('status', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="submitted">Submitted</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="waitlisted">Waitlisted</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={statusForm.data.notes}
                                    onChange={(e) => statusForm.setData('notes', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <SecondaryButton type="button" onClick={() => setShowStatusModal(false)}>
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={statusForm.processing}>
                                    Update Status
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {showNoteModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add Note</h3>
                        <form onSubmit={handleAddNote}>
                            <div className="mb-4">
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                    Note
                                </label>
                                <textarea
                                    id="note"
                                    rows={4}
                                    value={noteForm.data.note}
                                    onChange={(e) => noteForm.setData('note', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <SecondaryButton type="button" onClick={() => setShowNoteModal(false)}>
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={noteForm.processing}>
                                    Add Note
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
