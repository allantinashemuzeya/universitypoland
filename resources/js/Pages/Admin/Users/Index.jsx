import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Input } from '@/Components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Plus, MoreHorizontal, Edit, Eye, Power, Search, Users, Key, Mail } from 'lucide-react';

export default function Index({ users, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.role || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { 
            search: searchTerm,
            role: activeTab !== 'all' ? activeTab : null
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleToggleActive = (user) => {
        if (confirm(`Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user?`)) {
            router.post(route('admin.users.toggleActive', user.id));
        }
    };

    const handleResetPassword = (user) => {
        if (confirm(`Are you sure you want to reset the password for ${user.name}? They will receive an email with instructions.`)) {
            router.post(route('admin.users.resetPassword', user.id));
        }
    };

    const handleTabChange = (value) => {
        setActiveTab(value);
        router.get(route('admin.users.index'), { 
            search: searchTerm,
            role: value !== 'all' ? value : null
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getUserStats = (user) => {
        if (user.role === 'admin') {
            return null;
        }
        return {
            applications: user.applications_count || 0,
            documents: user.documents_count || 0,
        };
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">User Management</h2>}
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Actions */}
                    <div className="mb-6 flex justify-between items-center">
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                            <Input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" variant="outline">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                        <Link href={route('admin.users.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </Link>
                    </div>

                    {/* Tabs for filtering */}
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
                        <TabsList>
                            <TabsTrigger value="all">All Users</TabsTrigger>
                            <TabsTrigger value="student">Students</TabsTrigger>
                            <TabsTrigger value="admin">Admins</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Users Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stats
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => {
                                            const stats = getUserStats(user);
                                            return (
                                                <tr key={user.id} className={!user.is_active ? 'bg-gray-50' : ''}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <Users className="h-5 w-5 text-gray-600" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1">
                                                            <Badge variant={user.is_active ? 'success' : 'secondary'}>
                                                                {user.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                            {user.email_verified_at && (
                                                                <span className="text-xs text-gray-500">Verified</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {stats ? (
                                                            <div className="text-xs space-y-1">
                                                                <div>{stats.applications} applications</div>
                                                                <div>{stats.documents} documents</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <Link href={route('admin.users.show', user.id)}>
                                                                    <DropdownMenuItem>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link href={route('admin.users.edit', user.id)}>
                                                                    <DropdownMenuItem>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                                                    <Key className="mr-2 h-4 w-4" />
                                                                    Reset Password
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                                                                    <Power className="mr-2 h-4 w-4" />
                                                                    {user.is_active ? 'Deactivate' : 'Activate'}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {users.data.length === 0 && (
                                <div className="text-center py-12">
                                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm ? 'Try adjusting your search' : 'Get started by creating a new user'}
                                    </p>
                                    {!searchTerm && (
                                        <div className="mt-6">
                                            <Link href={route('admin.users.create')}>
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add User
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {users.links && users.data.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex space-x-2">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } ${!link.url && 'cursor-not-allowed opacity-50'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
