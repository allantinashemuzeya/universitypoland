import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
    Download, TrendingUp, Users, FileText, CheckCircle, XCircle, 
    Clock, Calendar, GraduationCap 
} from 'lucide-react';

export default function Index({ stats, chartData }) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Reports & Analytics</h2>}
        >
            <Head title="Reports & Analytics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Export Actions */}
                    <div className="mb-6 flex justify-end space-x-3">
                        <Link href={route('admin.reports.export', { type: 'applications' })}>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export Applications
                            </Button>
                        </Link>
                        <Link href={route('admin.reports.export', { type: 'users' })}>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export Users
                            </Button>
                        </Link>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            <span className="text-green-600">+{stats.newApplicationsThisWeek}</span> this week
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Students</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.activeStudents}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            <span className="text-green-600">+{stats.newStudentsThisMonth}</span> this month
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Users className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Acceptance Rate</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.acceptanceRate}%</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {stats.acceptedApplications} accepted
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.pendingReview}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Avg. {stats.avgReviewTime} days
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-yellow-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Applications by Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Applications by Status</CardTitle>
                                <CardDescription>Current distribution of application statuses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData.applicationsByStatus}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData.applicationsByStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Applications by Program */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Applications by Program</CardTitle>
                                <CardDescription>Distribution across different programs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData.applicationsByProgram}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="program" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Monthly Applications Trend */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Monthly Applications Trend</CardTitle>
                                <CardDescription>Application submissions over the last 12 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData.monthlyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="applications" stroke="#8884d8" />
                                        <Line type="monotone" dataKey="accepted" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Countries */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Countries</CardTitle>
                                <CardDescription>Students by country of origin</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {chartData.topCountries.map((country, index) => (
                                        <div key={country.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg font-medium">{index + 1}</span>
                                                <span className="text-sm">{country.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium">{country.count}</span>
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ width: `${(country.count / chartData.topCountries[0].count) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Stats */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Document Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Document Verification Status</CardTitle>
                                <CardDescription>Overview of document review progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">Verified</span>
                                            <span className="text-sm">{stats.documents.verified}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-600 h-2 rounded-full" 
                                                style={{ width: `${(stats.documents.verified / stats.documents.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">Pending</span>
                                            <span className="text-sm">{stats.documents.pending}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-yellow-600 h-2 rounded-full" 
                                                style={{ width: `${(stats.documents.pending / stats.documents.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">Rejected</span>
                                            <span className="text-sm">{stats.documents.rejected}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-red-600 h-2 rounded-full" 
                                                style={{ width: `${(stats.documents.rejected / stats.documents.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Program Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Program Performance</CardTitle>
                                <CardDescription>Key metrics by program</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                                                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Apps</th>
                                                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Accept %</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {chartData.programPerformance.map((program) => (
                                                <tr key={program.name}>
                                                    <td className="px-3 py-2 text-sm">{program.name}</td>
                                                    <td className="px-3 py-2 text-sm text-center">{program.applications}</td>
                                                    <td className="px-3 py-2 text-sm text-center">
                                                        <span className={`font-medium ${program.acceptanceRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {program.acceptanceRate}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
