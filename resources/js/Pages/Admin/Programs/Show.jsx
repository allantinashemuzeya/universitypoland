import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { ArrowLeft, Edit, Users, FileText, Calendar, DollarSign } from 'lucide-react';

export default function Show({ program, applications }) {
    const getStatusBadge = (status) => {
        const statusClasses = {
            draft: 'default',
            submitted: 'secondary',
            under_review: 'warning',
            accepted: 'success',
            rejected: 'destructive',
            withdrawn: 'outline',
        };
        return statusClasses[status] || 'default';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Program Details</h2>}
        >
            <Head title={`Program: ${program.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <Link href={route('admin.programs.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Programs
                            </Button>
                        </Link>
                        <Link href={route('admin.programs.edit', program.id)}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Program
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        {program.name}
                                        <Badge variant={program.is_active ? 'success' : 'secondary'}>
                                            {program.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>{program.code}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-2">Description</h3>
                                        <p className="text-gray-600 whitespace-pre-wrap">{program.description}</p>
                                    </div>

                                    {program.requirements && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Requirements</h3>
                                            <p className="text-gray-600 whitespace-pre-wrap">{program.requirements}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Duration</p>
                                                <p className="font-medium">{program.duration_years} years</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Tuition Fee</p>
                                                <p className="font-medium">{formatCurrency(program.tuition_fee)}/year</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Applications Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Applications</CardTitle>
                                    <CardDescription>Latest applications for this program</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {applications && applications.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Student
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Status
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Applied
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {applications.map((application) => (
                                                        <tr key={application.id}>
                                                            <td className="px-4 py-3 text-sm">
                                                                <div>
                                                                    <p className="font-medium">{application.user.name}</p>
                                                                    <p className="text-gray-500">{application.user.email}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                <Badge variant={getStatusBadge(application.status)}>
                                                                    {application.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                                {new Date(application.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                <Link
                                                                    href={route('admin.applications.show', application.id)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    View
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">No applications yet</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Key Dates */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Dates</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Application Deadline</p>
                                        <p className="font-medium">
                                            {new Date(program.application_deadline).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Program Start Date</p>
                                        <p className="font-medium">
                                            {new Date(program.start_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Program End Date</p>
                                        <p className="font-medium">
                                            {new Date(program.end_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statistics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Total Applications</span>
                                        <span className="font-semibold">{program.applications_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Accepted</span>
                                        <span className="font-semibold text-green-600">{program.accepted_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Pending Review</span>
                                        <span className="font-semibold text-yellow-600">{program.pending_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Rejected</span>
                                        <span className="font-semibold text-red-600">{program.rejected_count || 0}</span>
                                    </div>
                                    {program.applications_count > 0 && (
                                        <div className="pt-2 border-t">
                                            <p className="text-sm text-gray-500">Acceptance Rate</p>
                                            <p className="text-2xl font-bold">
                                                {((program.accepted_count / program.applications_count) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Program Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Program Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Degree Type</p>
                                        <Badge variant="outline" className="mt-1">
                                            {program.degree_type}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Created</p>
                                        <p className="text-sm">{new Date(program.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="text-sm">{new Date(program.updated_at).toLocaleDateString()}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
