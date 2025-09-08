<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Notifications\DocumentUploaded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display pending documents
     */
    public function pending()
    {
        $documents = Document::where('verification_status', 'pending')
            ->with(['application.user', 'application.program'])
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return Inertia::render('Admin/Documents/Pending', [
            'documents' => $documents,
        ]);
    }

    /**
     * Review a specific document
     */
    public function review(Document $document)
    {
        $document->load(['application.user', 'application.program']);

        return Inertia::render('Admin/Documents/Review', [
            'document' => $document,
        ]);
    }

    /**
     * Update document status
     */
    public function updateStatus(Request $request, Document $document)
    {
        $request->validate([
            'status' => 'required|in:verified,rejected',
            'review_notes' => 'nullable|string|max:500',
        ]);

        $document->update([
            'verification_status' => $request->status,
            'rejection_reason' => $request->status === 'rejected' ? $request->review_notes : null,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        // Notify the student about document review
        $document->application->user->notify(new DocumentUploaded($document->application, $document, 'admin'));

        return redirect()->route('admin.documents.pending')
            ->with('success', "Document {$request->status} successfully.");
    }

    /**
     * Download a document
     */
    public function download(Document $document)
    {
        if (!Storage::disk('private')->exists($document->file_path)) {
            abort(404, 'Document file not found.');
        }
        
        $path = Storage::disk('private')->path($document->file_path);
        
        return response()->download($path, $document->file_name);
    }

    /**
     * View document in browser
     */
    public function view(Document $document)
    {
        if (!Storage::disk('private')->exists($document->file_path)) {
            abort(404, 'Document file not found.');
        }
        
        $path = Storage::disk('private')->path($document->file_path);
        
        return response()->file($path);
    }

    /**
     * Bulk approve documents
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'document_ids' => 'required|array',
            'document_ids.*' => 'exists:documents,id',
        ]);

        Document::whereIn('id', $request->document_ids)
            ->where('verification_status', 'pending')
            ->update([
                'verification_status' => 'verified',
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);

        return redirect()->back()
            ->with('success', count($request->document_ids) . ' documents approved successfully.');
    }

    /**
     * Bulk reject documents
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'document_ids' => 'required|array',
            'document_ids.*' => 'exists:documents,id',
            'review_notes' => 'required|string|max:500',
        ]);

        Document::whereIn('id', $request->document_ids)
            ->where('verification_status', 'pending')
            ->update([
                'verification_status' => 'rejected',
                'rejection_reason' => $request->review_notes,
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);

        return redirect()->back()
            ->with('success', count($request->document_ids) . ' documents rejected.');
    }
}
