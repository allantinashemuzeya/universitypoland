import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        degree_type: 'bachelor',
        duration_years: '4',
        description: '',
        requirements: '',
        application_deadline: '',
        start_date: '',
        end_date: '',
        tuition_fee: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.programs.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create New Program</h2>}
        >
            <Head title="Create Program" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('admin.programs.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Programs
                            </Button>
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Program Details</CardTitle>
                                <CardDescription>
                                    Enter the details for the new academic program
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Program Name *</Label>
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
                                        <Label htmlFor="code">Program Code *</Label>
                                        <Input
                                            id="code"
                                            type="text"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="e.g., CS-BSC-2024"
                                            required
                                        />
                                        {errors.code && (
                                            <p className="text-sm text-red-600">{errors.code}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="degree_type">Degree Type *</Label>
                                        <select
                                            id="degree_type"
                                            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.degree_type}
                                            onChange={(e) => setData('degree_type', e.target.value)}
                                            required
                                        >
                                            <option value="bachelor">Bachelor's</option>
                                            <option value="master">Master's</option>
                                            <option value="phd">PhD</option>
                                            <option value="diploma">Diploma</option>
                                        </select>
                                        {errors.degree_type && (
                                            <p className="text-sm text-red-600">{errors.degree_type}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration_years">Duration (Years) *</Label>
                                        <Input
                                            id="duration_years"
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={data.duration_years}
                                            onChange={(e) => setData('duration_years', e.target.value)}
                                            required
                                        />
                                        {errors.duration_years && (
                                            <p className="text-sm text-red-600">{errors.duration_years}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <textarea
                                        id="description"
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter a detailed description of the program..."
                                        required
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Requirements */}
                                <div className="space-y-2">
                                    <Label htmlFor="requirements">Requirements</Label>
                                    <textarea
                                        id="requirements"
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={4}
                                        value={data.requirements}
                                        onChange={(e) => setData('requirements', e.target.value)}
                                        placeholder="List the requirements for this program..."
                                    />
                                    {errors.requirements && (
                                        <p className="text-sm text-red-600">{errors.requirements}</p>
                                    )}
                                </div>

                                {/* Dates and Fees */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="application_deadline">Application Deadline *</Label>
                                        <Input
                                            id="application_deadline"
                                            type="date"
                                            value={data.application_deadline}
                                            onChange={(e) => setData('application_deadline', e.target.value)}
                                            required
                                        />
                                        {errors.application_deadline && (
                                            <p className="text-sm text-red-600">{errors.application_deadline}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tuition_fee">Tuition Fee (per year)</Label>
                                        <Input
                                            id="tuition_fee"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.tuition_fee}
                                            onChange={(e) => setData('tuition_fee', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors.tuition_fee && (
                                            <p className="text-sm text-red-600">{errors.tuition_fee}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Start Date *</Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="text-sm text-red-600">{errors.start_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">End Date *</Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            required
                                        />
                                        {errors.end_date && (
                                            <p className="text-sm text-red-600">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Active Status */}
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="is_active"
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                        />
                                        <Label htmlFor="is_active" className="cursor-pointer">
                                            Program is active and accepting applications
                                        </Label>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-4 pt-4">
                                    <Link href={route('admin.programs.index')}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Program
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
