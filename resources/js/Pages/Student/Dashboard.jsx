import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    FileText, 
    Plus, 
    Upload, 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    MessageSquare,
    TrendingUp,
    BookOpen,
    Calendar,
    ChevronRight
} from 'lucide-react';

export default function Dashboard({ applications = [], recentCommunications = [] }) {
    const user = usePage().props.auth.user;

    const getStatusVariant = (status) => {
        const variants = {
            'draft': 'secondary',
            'submitted': 'default',
            'under_review': 'outline',
            'documents_requested': 'outline',
            'accepted': 'success',
            'rejected': 'destructive',
            'withdrawn': 'secondary',
            'waitlisted': 'outline'
        };
        return variants[status] || 'default';
    };

    const getProgressValue = (status) => {
        const progress = {
            'draft': 20,
            'submitted': 40,
            'under_review': 60,
            'documents_requested': 50,
            'accepted': 100,
            'rejected': 100,
            'withdrawn': 100,
            'waitlisted': 80
        };
        return progress[status] || 0;
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'draft':
                return <FileText className="w-4 h-4" />;
            case 'submitted':
            case 'under_review':
                return <Clock className="w-4 h-4" />;
            case 'accepted':
                return <CheckCircle className="w-4 h-4" />;
            case 'rejected':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="font-display text-3xl font-bold text-gray-900">
                        Welcome back, {user.name}!
                    </h2>
                    <p className="text-gray-600 mt-1">Manage your applications and track your progress</p>
                </div>
            }
        >
            <Head title="Student Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Applications
                                </CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{applications.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Track all your applications
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Accepted
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {applications.filter(a => a.status === 'accepted').length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Congratulations!
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    In Progress
                                </CardTitle>
                                <Clock className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {applications.filter(a => ['submitted', 'under_review'].includes(a.status)).length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Being reviewed
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Unread Messages
                                </CardTitle>
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {recentCommunications.filter(c => !c.is_read).length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    New notifications
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="bg-gradient-to-r from-red-500 to-red-700">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">Quick Actions</CardTitle>
                            <CardDescription className="text-red-100">
                                Get started with your application journey
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            <Link href={route('student.applications.create')}>
                                <Button variant="secondary" size="lg" className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    New Application
                                </Button>
                            </Link>
                            <Link href={route('student.applications.index')}>
                                <Button variant="outline" size="lg" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                                    <FileText className="w-4 h-4" />
                                    View All Applications
                                </Button>
                            </Link>
                            <Link href={route('student.documents')}>
                                <Button variant="outline" size="lg" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                                    <Upload className="w-4 h-4" />
                                    Upload Documents
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Applications & Communications */}
                    <Tabs defaultValue="applications" className="space-y-4">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="applications">Applications</TabsTrigger>
                            <TabsTrigger value="communications">Messages</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="applications" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Your Applications</CardTitle>
                                        <Link href={route('student.applications.index')}>
                                            <Button variant="ghost" size="sm">
                                                View All <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {applications.length === 0 ? (
                                        <div className="text-center py-12">
                                            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-600 mb-4">You haven't started any applications yet.</p>
                                            <Link href={route('student.applications.create')}>
                                                <Button size="lg">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Start Your First Application
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {applications.slice(0, 3).map((application) => (
                                                <Card key={application.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-6">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="space-y-1">
                                                                <h4 className="text-lg font-semibold">
                                                                    {application.program.name}
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Application #{application.application_number}
                                                                </p>
                                                            </div>
                                                            <Badge variant={getStatusVariant(application.status)}>
                                                                <span className="flex items-center gap-1">
                                                                    {getStatusIcon(application.status)}
                                                                    {application.status.replace('_', ' ')}
                                                                </span>
                                                            </Badge>
                                                        </div>
                                                        
                                                        {/* Progress Bar */}
                                                        <div className="mb-4">
                                                            <div className="flex justify-between text-sm mb-2">
                                                                <span className="text-muted-foreground">Progress</span>
                                                                <span className="font-medium">{getProgressValue(application.status)}%</span>
                                                            </div>
                                                            <div className="w-full bg-secondary rounded-full h-2">
                                                                <div 
                                                                    className="bg-primary h-2 rounded-full transition-all duration-500"
                                                                    style={{ width: `${getProgressValue(application.status)}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                {application.submission_date ? (
                                                                    <>Submitted {new Date(application.submission_date).toLocaleDateString()}</>
                                                                ) : (
                                                                    <>Created {new Date(application.created_at).toLocaleDateString()}</>
                                                                )}
                                                            </div>
                                                            <Link href={route('student.applications.show', application.id)}>
                                                                <Button variant="link" size="sm">
                                                                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="communications" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Messages</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentCommunications.length === 0 ? (
                                        <div className="text-center py-12">
                                            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-600">No messages yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recentCommunications.slice(0, 5).map((communication) => (
                                                <div key={communication.id} className="flex items-start space-x-4">
                                                    <div className={`w-2 h-2 rounded-full mt-2 ${communication.is_read ? 'bg-gray-300' : 'bg-primary'}`} />
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h4 className={`text-sm font-medium leading-none ${!communication.is_read && 'font-semibold'}`}>
                                                                    {communication.subject}
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                    {communication.message}
                                                                </p>
                                                            </div>
                                                            <Badge variant="outline" className="ml-2">
                                                                {new Date(communication.created_at).toLocaleDateString()}
                                                            </Badge>
                                                        </div>
                                                        <Link href={route('student.communications.show', communication.id)}>
                                                            <Button variant="link" size="sm" className="p-0 h-auto">
                                                                Read More <ChevronRight className="w-4 h-4 ml-1" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Getting Started Guide for new users */}
                    {applications.length === 0 && (
                        <Alert>
                            <TrendingUp className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Getting Started:</strong> Begin your journey by exploring available programs and submitting your first application. Make sure to prepare all required documents before starting.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
