import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ 
    stats = {}, 
    recentApplications = [], 
    pendingDocuments = [],
    upcomingDeadlines = []
}) {
    const getStatusColor = (status) => {
        const colors = {
            'draft': 'bg-gray-100 text-gray-800',
            'submitted': 'bg-blue-100 text-blue-800',
            'under_review': 'bg-yellow-100 text-yellow-800',
            'documents_requested': 'bg-orange-100 text-orange-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'withdrawn': 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-display text-2xl font-bold text-dark-900">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                    <p className="text-3xl font-bold text-dark-900">{stats.totalApplications || 0}</p>
                                </div>
                                <div className="bg-primary-100 p-3 rounded-lg">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="text-green-600 font-medium">+{stats.newThisWeek || 0}</span> this week
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingReview || 0}</p>
                                </div>
                                <div className="bg-yellow-100 p-3 rounded-lg">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Awaiting decision</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Documents to Verify</p>
                                    <p className="text-3xl font-bold text-orange-600">{stats.pendingDocuments || 0}</p>
                                </div>
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Needs verification</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.activeStudents || 0}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Registered students</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        <h3 className="text-lg font-semibold text-dark-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link
                                href={route('admin.applications.index')}
                                className="bg-primary-600 text-white p-4 rounded-lg text-center hover:bg-primary-700 transition"
                            >
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-medium">All Applications</span>
                            </Link>
                            <Link
                                href={route('admin.programs.index')}
                                className="bg-dark-700 text-white p-4 rounded-lg text-center hover:bg-dark-800 transition"
                            >
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className="text-sm font-medium">Programs</span>
                            </Link>
                            <Link
                                href={route('admin.users.index')}
                                className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition"
                            >
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-sm font-medium">Students</span>
                            </Link>
                            <Link
                                href={route('admin.reports')}
                                className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition"
                            >
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="text-sm font-medium">Reports</span>
                            </Link>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Recent Applications */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-dark-900">Recent Applications</h3>
                                <Link
                                    href={route('admin.applications.index')}
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentApplications.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No recent applications</p>
                                ) : (
                                    recentApplications.map((application) => (
                                        <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-dark-900">
                                                        {application.user.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {application.program.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(application.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                                    {application.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-dark-900">Upcoming Deadlines</h3>
                                <Link
                                    href={route('admin.programs.index')}
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    Manage →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {upcomingDeadlines.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No upcoming deadlines</p>
                                ) : (
                                    upcomingDeadlines.map((program) => (
                                        <div key={program.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-dark-900">
                                                        {program.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        Deadline: {new Date(program.application_deadline).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-primary-600">
                                                        {Math.ceil((new Date(program.application_deadline) - new Date()) / (1000 * 60 * 60 * 24))}
                                                    </p>
                                                    <p className="text-xs text-gray-500">days left</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Documents Pending Review */}
                    <div className="bg-white p-6 rounded-lg shadow mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-dark-900">Documents Pending Review</h3>
                            <Link
                                href={route('admin.documents.pending')}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            {pendingDocuments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No documents pending review</p>
                            ) : (
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Student</th>
                                            <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Document Type</th>
                                            <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Application</th>
                                            <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Uploaded</th>
                                            <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingDocuments.map((document) => (
                                            <tr key={document.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm">{document.application.user.name}</td>
                                                <td className="py-3 px-4 text-sm">
                                                    <span className="capitalize">{document.type.replace('_', ' ')}</span>
                                                </td>
                                                <td className="py-3 px-4 text-sm">{document.application.application_number}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500">
                                                    {new Date(document.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    <Link
                                                        href={route('admin.documents.review', document.id)}
                                                        className="text-primary-600 hover:text-primary-700 font-medium"
                                                    >
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
