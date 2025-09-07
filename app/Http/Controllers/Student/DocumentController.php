<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Document;
use App\Notifications\DocumentUploaded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $documents = Document::whereHas('application', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->with('application.program')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Student/Documents/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'application_id' => 'required|exists:applications,id',
            'type' => 'required|in:passport,transcript,diploma,language_certificate,cv,recommendation_letter,other',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max
            'description' => 'nullable|string|max:255',
        ]);

        // Verify the application belongs to the authenticated user
        $application = Application::where('id', $request->application_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Store the file
        $path = $request->file('file')->store('documents/' . $application->id, 'private');

        // Create document record
        $document = Document::create([
            'application_id' => $application->id,
            'type' => $request->type,
            'file_name' => $request->file('file')->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $request->file('file')->getSize(),
            'mime_type' => $request->file('file')->getMimeType(),
            'description' => $request->description,
            'status' => 'pending',
        ]);

        // Notify admins about new document
        // This would typically notify specific admins
        // For now, we'll just log it
        
        return redirect()->back()
            ->with('success', 'Document uploaded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        // Verify the document belongs to the authenticated user's application
        if ($document->application->user_id !== auth()->id()) {
            abort(403);
        }

        $path = Storage::disk('private')->path($document->file_path);
        
        if (!Storage::disk('private')->exists($document->file_path)) {
            abort(404, 'Document file not found.');
        }

        return response()->file($path);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        // Verify the document belongs to the authenticated user's application
        if ($document->application->user_id !== auth()->id()) {
            abort(403);
        }

        // Only allow deletion if the application is still in draft status
        if ($document->application->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Cannot delete documents from submitted applications.');
        }

        // Delete the file
        Storage::disk('private')->delete($document->file_path);

        // Delete the database record
        $document->delete();

        return redirect()->back()
            ->with('success', 'Document deleted successfully.');
    }
}
