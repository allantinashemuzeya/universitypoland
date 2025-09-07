<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Program;
use App\Models\User;
use App\Notifications\ApplicationStatusChanged;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Application::with(['user', 'program', 'documents']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by program
        if ($request->has('program_id') && $request->program_id !== 'all') {
            $query->where('program_id', $request->program_id);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('passport_number', 'like', "%{$search}%");
            });
        }

        $applications = $query->orderBy('created_at', 'desc')->paginate(20);

        $programs = Program::orderBy('name')->get();

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'programs' => $programs,
            'filters' => $request->only(['status', 'program_id', 'search']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Application $application)
    {
        $application->load([
            'user',
            'program',
            'documents',
            'statusHistories.changedBy',
            'communications.sender'
        ]);

        return Inertia::render('Admin/Applications/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Update application status
     */
    public function updateStatus(Request $request, Application $application)
    {
        $request->validate([
            'status' => 'required|in:submitted,under_review,accepted,rejected,waitlisted',
            'notes' => 'nullable|string|max:500',
        ]);

        $oldStatus = $application->status;
        
        $application->update([
            'status' => $request->status,
        ]);

        // Create status history
        $application->statusHistories()->create([
            'from_status' => $oldStatus,
            'to_status' => $request->status,
            'comment' => $request->notes,
            'changed_by' => auth()->id(),
        ]);

        // Notify the student
        $application->user->notify(new ApplicationStatusChanged($application, $oldStatus, $request->notes));

        return redirect()->back()
            ->with('success', "Application status updated from {$oldStatus} to {$request->status}.");
    }

    /**
     * Add a note to the application
     */
    public function addNote(Request $request, Application $application)
    {
        $request->validate([
            'note' => 'required|string|max:1000',
        ]);

        $application->statusHistories()->create([
            'from_status' => $application->status,
            'to_status' => $application->status,
            'comment' => $request->note,
            'changed_by' => auth()->id(),
        ]);

        return redirect()->back()
            ->with('success', 'Note added successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Application $application)
    {
        // Only allow deletion of draft applications
        if ($application->status !== 'draft') {
            return redirect()->route('admin.applications.index')
                ->with('error', 'Only draft applications can be deleted.');
        }

        $application->delete();

        return redirect()->route('admin.applications.index')
            ->with('success', 'Application deleted successfully.');
    }

    /**
     * Export applications to CSV
     */
    public function export(Request $request)
    {
        $query = Application::with(['user', 'program']);

        // Apply same filters as index
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('program_id') && $request->program_id !== 'all') {
            $query->where('program_id', $request->program_id);
        }

        $applications = $query->get();

        $csvData = "ID,Name,Email,Program,Status,Submission Date,Created At\n";
        
        foreach ($applications as $app) {
            $csvData .= "{$app->id},";
            $csvData .= "\"{$app->first_name} {$app->last_name}\",";
            $csvData .= "{$app->email},";
            $csvData .= "\"{$app->program->name}\",";
            $csvData .= "{$app->status},";
            $csvData .= ($app->submission_date ? $app->submission_date->format('Y-m-d') : 'Not submitted') . ",";
            $csvData .= "{$app->created_at->format('Y-m-d')}\n";
        }

        return response($csvData)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="applications-' . now()->format('Y-m-d') . '.csv"');
    }
}
