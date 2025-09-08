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
import { Plus, MoreHorizontal, Edit, Eye, Power, Search, GraduationCap } from 'lucide-react';

export default function Index({ programs, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.programs.index'), { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleToggleActive = (program) => {
        if (confirm(`Are you sure you want to ${program.is_active ? 'deactivate' : 'activate'} this program?`)) {
            router.post(route('admin.programs.toggleActive', program.id));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDegreeTypeBadge = (type) => {
        const variants = {
            'bachelor': 'default',
            'master': 'secondary',
            'phd': 'destructive',
            'diploma': 'outline',
        };
        return variants[type] || 'default';
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Programs Management</h2>}
        >
            <Head title="Programs Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Actions */}
                    <div className="mb-6 flex justify-between items-center">
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                            <Input
                                type="text"
                                placeholder="Search programs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" variant="outline">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                        <Link href={route('admin.programs.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Program
                            </Button>
                        </Link>
                    </div>

                    {/* Programs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.data.map((program) => (
                            <Card key={program.id} className={!program.is_active ? 'opacity-60' : ''}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <GraduationCap className="h-5 w-5" />
                                                {program.name}
                                            </CardTitle>
                                            <CardDescription>{program.code}</CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <Link href={route('admin.programs.show', program.id)}>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={route('admin.programs.edit', program.id)}>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem onClick={() => handleToggleActive(program)}>
                                                    <Power className="mr-2 h-4 w-4" />
                                                    {program.is_active ? 'Deactivate' : 'Activate'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Degree Type</span>
                                            <Badge variant={getDegreeTypeBadge(program.degree_type)}>
                                                {program.degree_type}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Duration</span>
                                            <span className="text-sm font-medium">{program.duration_years} years</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Applications</span>
                                            <span className="text-sm font-medium">{program.applications_count || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Deadline</span>
                                            <span className="text-sm font-medium">
                                                {formatDate(program.application_deadline)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Status</span>
                                            <Badge variant={program.is_active ? 'success' : 'secondary'}>
                                                {program.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {programs.data.length === 0 && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-lg font-medium text-gray-900">No programs found</p>
                                <p className="text-gray-500 mb-4">
                                    {searchTerm ? 'Try adjusting your search' : 'Get started by creating a new program'}
                                </p>
                                {!searchTerm && (
                                    <Link href={route('admin.programs.create')}>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add First Program
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {programs.links && programs.data.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex space-x-2">
                                {programs.links.map((link, index) => (
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
