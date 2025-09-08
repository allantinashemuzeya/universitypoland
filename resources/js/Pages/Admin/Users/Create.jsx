import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { ArrowLeft, Save, Info } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
        is_active: true,
        send_welcome_email: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create New User</h2>}
        >
            <Head title="Create User" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('admin.users.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Button>
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>User Details</CardTitle>
                                <CardDescription>
                                    Create a new user account. The user will receive an email with login instructions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Personal Information</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Account Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Account Settings</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password *</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-600">{errors.password}</p>
                                            )}
                                            <p className="text-xs text-gray-500">Minimum 8 characters</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirm Password *</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                            {errors.password_confirmation && (
                                                <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">User Role *</Label>
                                        <select
                                            id="role"
                                            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            required
                                        >
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        {errors.role && (
                                            <p className="text-sm text-red-600">{errors.role}</p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            {data.role === 'admin' 
                                                ? 'Admin users have full access to the system'
                                                : 'Student users can apply for programs and manage their applications'
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Options */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Additional Options</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                id="is_active"
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                            />
                                            <Label htmlFor="is_active" className="cursor-pointer">
                                                Account is active
                                            </Label>
                                        </div>
                                        <p className="text-xs text-gray-500 ml-6">
                                            Inactive accounts cannot log in to the system
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                id="send_welcome_email"
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                checked={data.send_welcome_email}
                                                onChange={(e) => setData('send_welcome_email', e.target.checked)}
                                            />
                                            <Label htmlFor="send_welcome_email" className="cursor-pointer">
                                                Send welcome email
                                            </Label>
                                        </div>
                                        <p className="text-xs text-gray-500 ml-6">
                                            Send the user an email with their login credentials
                                        </p>
                                    </div>
                                </div>

                                {/* Information Alert */}
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        The user will receive an email with their login credentials and instructions 
                                        to verify their email address. Make sure the email address is correct.
                                    </AlertDescription>
                                </Alert>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-4 pt-4">
                                    <Link href={route('admin.users.index')}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create User
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
