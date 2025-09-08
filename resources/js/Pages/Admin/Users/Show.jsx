import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { ArrowLeft, Edit, Mail, Calendar, FileText, Shield, Users } from 'lucide-react';

export default function Show({ user, applications, documents }) {
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

    const getDocumentStatusBadge = (status) => {
        const statusClasses = {
            pending: 'warning',
            verified: 'success',
            rejected: 'destructive',
        };
        return statusClasses[status] || 'default';
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">User Details</h2>}
        >
            <Head title={`User: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <Link href={route('admin.users.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Button>
                        </Link>
                        <Link href={route('admin.users.edit', user.id)}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Profile Card */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                                            <Users className="h-8 w-8 text-gray-600" />
                                        </div>
                                        <div>
                                            <CardTitle>{user.name}</CardTitle>
                                            <CardDescription>{user.email}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Role</span>
                                            <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Status</span>
                                            <Badge variant={user.is_active ? 'success' : 'secondary'}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Email Verified</span>
                                            <span className="text-sm font-medium">
                                                {user.email_verified_at ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Joined</span>
                                            <span className="text-sm">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {user.role === 'student' && (
                                        <div className="pt-4 border-t">
                                            <h4 className="font-medium mb-3">Statistics</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Applications</span>
                                                    <span className="font-semibold">{applications?.length || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Documents</span>
                                                    <span className="font-semibold">{documents?.length || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Accepted</span>
                                                    <span className="font-semibold text-green-600">
                                                        {applications?.filter(a => a.status === 'accepted').length || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {user.role === 'student' ? (
                                <Tabs defaultValue="applications">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="applications">Applications</TabsTrigger>
                                        <TabsTrigger value="documents">Documents</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="applications">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Applications</CardTitle>
                                                <CardDescription>All applications submitted by this user</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {applications && applications.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {applications.map((application) => (
                                                            <div key={application.id} className="border rounded-lg p-4">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium">{application.program.name}</h4>
                                                                        <p className="text-sm text-gray-500 mt-1">
                                                                            Applied on {new Date(application.created_at).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <Badge variant={getStatusBadge(application.status)}>
                                                                        {application.status}
                                                                    </Badge>
                                                                </div>
                                                                <div className="mt-3 flex justify-end">
                                                                    <Link
                                                                        href={route('admin.applications.show', application.id)}
                                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        View Application →
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                                        <p className="mt-2 text-sm text-gray-500">No applications yet</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="documents">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Documents</CardTitle>
                                                <CardDescription>All documents uploaded by this user</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {documents && documents.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {documents.map((document) => (
                                                            <div key={document.id} className="border rounded-lg p-4">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium">{document.type}</h4>
                                                                        <p className="text-sm text-gray-500">
                                                                            {document.application.program.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 mt-1">
                                                                            Uploaded on {new Date(document.created_at).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <Badge variant={getDocumentStatusBadge(document.status)}>
                                                                        {document.status}
                                                                    </Badge>
                                                                </div>
                                                                <div className="mt-3 flex justify-end">
                                                                    <Link
                                                                        href={route('admin.documents.review', document.id)}
                                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        Review Document →
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                                        <p className="mt-2 text-sm text-gray-500">No documents uploaded</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            ) : (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Admin User</CardTitle>
                                        <CardDescription>
                                            This user has administrative privileges
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Shield className="h-5 w-5" />
                                            <p>Full system access granted</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
