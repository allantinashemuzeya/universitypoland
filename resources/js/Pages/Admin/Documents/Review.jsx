import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { CheckCircle, XCircle, Download, Eye } from 'lucide-react';

export default function Review({ document }) {
    const [reviewNotes, setReviewNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleStatusUpdate = (status) => {
        setProcessing(true);
        router.post(route('admin.documents.updateStatus', document.id), {
            status: status,
            review_notes: reviewNotes,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'verified':
                return 'success';
            case 'rejected':
                return 'destructive';
            default:
                return 'default';
        }
    };

    const getDocumentTypeLabel = (type) => {
        const labels = {
            passport: 'Passport',
            transcript: 'Academic Transcript',
            diploma: 'Diploma/Degree Certificate',
            language_certificate: 'Language Certificate',
            cv: 'CV/Resume',
            recommendation_letter: 'Recommendation Letter',
            other: 'Other Document',
        };
        return labels[type] || type;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Review Document</h2>}
        >
            <Head title="Review Document" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Document Details</CardTitle>
                            <CardDescription>
                                Review and verify student submitted document
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Document Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Document Type</Label>
                                    <p className="text-lg font-medium">{getDocumentTypeLabel(document.type)}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">
                                        <Badge variant={getStatusBadgeVariant(document.status)}>
                                            {document.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <Label>File Name</Label>
                                    <p>{document.file_name}</p>
                                </div>
                                <div>
                                    <Label>File Size</Label>
                                    <p>{(document.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <div>
                                    <Label>Uploaded At</Label>
                                    <p>{new Date(document.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Label>MIME Type</Label>
                                    <p>{document.mime_type}</p>
                                </div>
                            </div>

                            {document.description && (
                                <div>
                                    <Label>Description</Label>
                                    <p className="text-gray-600 dark:text-gray-400">{document.description}</p>
                                </div>
                            )}

                            {/* Student Info */}
                            <div className="border-t pt-4">
                                <h3 className="font-medium text-lg mb-3">Student Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Name</Label>
                                        <p>{document.application.user.name}</p>
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <p>{document.application.user.email}</p>
                                    </div>
                                    <div>
                                        <Label>Program</Label>
                                        <p>{document.application.program.name}</p>
                                    </div>
                                    <div>
                                        <Label>Application ID</Label>
                                        <p>#{document.application.id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Actions */}
                            <div className="border-t pt-4">
                                <h3 className="font-medium text-lg mb-3">Document Actions</h3>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => window.open(route('admin.documents.view', document.id), '_blank')}
                                        variant="outline"
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Document
                                    </Button>
                                    <Button
                                        onClick={() => window.location.href = route('admin.documents.download', document.id)}
                                        variant="outline"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Document
                                    </Button>
                                </div>
                            </div>

                            {/* Review Actions */}
                            {document.status === 'pending' && (
                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-lg mb-3">Review Decision</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="review-notes">Review Notes (Optional for approval, required for rejection)</Label>
                                            <Input
                                                id="review-notes"
                                                type="text"
                                                value={reviewNotes}
                                                onChange={(e) => setReviewNotes(e.target.value)}
                                                placeholder="Enter any notes about this document..."
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => handleStatusUpdate('verified')}
                                                disabled={processing}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Approve Document
                                            </Button>
                                            <Button
                                                onClick={() => handleStatusUpdate('rejected')}
                                                disabled={processing || !reviewNotes}
                                                variant="destructive"
                                            >
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Reject Document
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Previous Review Info */}
                            {document.status !== 'pending' && (
                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-lg mb-3">Review Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Reviewed By</Label>
                                            <p>Admin #{document.verified_by}</p>
                                        </div>
                                        <div>
                                            <Label>Reviewed At</Label>
                                            <p>{document.verified_at ? new Date(document.verified_at).toLocaleString() : '-'}</p>
                                        </div>
                                        {document.rejection_reason && (
                                            <div className="col-span-2">
                                                <Label>Rejection Reason</Label>
                                                <p className="text-red-600 dark:text-red-400">{document.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
