<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Program;
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
        $applications = Application::where('user_id', $request->user()->id)
            ->with(['program', 'documents', 'statusHistories'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Student/Applications/Index', [
            'applications' => $applications,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $programs = Program::where('is_active', true)
            ->where('application_deadline', '>=', now())
            ->orderBy('name')
            ->get();

        return Inertia::render('Student/Applications/Create', [
            'programs' => $programs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'nationality' => 'required|string|max:255',
            'passport_number' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'education_level' => 'required|string|max:255',
            'institution_name' => 'required|string|max:255',
            'graduation_year' => 'required|integer|min:1950|max:' . (date('Y') + 5),
            'gpa' => 'nullable|numeric|min:0|max:5',
            'english_proficiency' => 'required|string|max:255',
            'english_test_score' => 'nullable|string|max:255',
            'motivation_letter' => 'required|string|min:200',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:255',
            'emergency_contact_relationship' => 'required|string|max:255',
        ]);

        $application = Application::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'draft',
            'submission_date' => null,
        ]);

        return redirect()->route('student.applications.show', $application)
            ->with('success', 'Application created successfully. Please upload required documents.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Application $application)
    {
        // Ensure the user can only view their own applications
        if ($application->user_id !== auth()->id()) {
            abort(403);
        }

        $application->load(['program', 'documents', 'statusHistories', 'communications']);

        return Inertia::render('Student/Applications/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Application $application)
    {
        // Ensure the user can only edit their own applications
        if ($application->user_id !== auth()->id()) {
            abort(403);
        }

        // Can only edit draft applications
        if ($application->status !== 'draft') {
            return redirect()->route('student.applications.show', $application)
                ->with('error', 'You cannot edit a submitted application.');
        }

        $programs = Program::where('is_active', true)
            ->where('application_deadline', '>=', now())
            ->orderBy('name')
            ->get();

        return Inertia::render('Student/Applications/Edit', [
            'application' => $application,
            'programs' => $programs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Application $application)
    {
        // Ensure the user can only update their own applications
        if ($application->user_id !== auth()->id()) {
            abort(403);
        }

        // Can only update draft applications
        if ($application->status !== 'draft') {
            return redirect()->route('student.applications.show', $application)
                ->with('error', 'You cannot edit a submitted application.');
        }

        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'nationality' => 'required|string|max:255',
            'passport_number' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'education_level' => 'required|string|max:255',
            'institution_name' => 'required|string|max:255',
            'graduation_year' => 'required|integer|min:1950|max:' . (date('Y') + 5),
            'gpa' => 'nullable|numeric|min:0|max:5',
            'english_proficiency' => 'required|string|max:255',
            'english_test_score' => 'nullable|string|max:255',
            'motivation_letter' => 'required|string|min:200',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:255',
            'emergency_contact_relationship' => 'required|string|max:255',
        ]);

        $application->update($validated);

        return redirect()->route('student.applications.show', $application)
            ->with('success', 'Application updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Application $application)
    {
        // Ensure the user can only delete their own applications
        if ($application->user_id !== auth()->id()) {
            abort(403);
        }

        // Can only delete draft applications
        if ($application->status !== 'draft') {
            return redirect()->route('student.applications.index')
                ->with('error', 'You cannot delete a submitted application.');
        }

        $application->delete();

        return redirect()->route('student.applications.index')
            ->with('success', 'Application deleted successfully.');
    }

    /**
     * Submit the application for review
     */
    public function submit(Application $application)
    {
        // Ensure the user can only submit their own applications
        if ($application->user_id !== auth()->id()) {
            abort(403);
        }

        // Check if all required documents are uploaded
        $requiredDocuments = ['passport', 'transcript', 'diploma'];
        $uploadedTypes = $application->documents->pluck('type')->toArray();
        
        foreach ($requiredDocuments as $docType) {
            if (!in_array($docType, $uploadedTypes)) {
                return redirect()->route('student.applications.show', $application)
                    ->with('error', 'Please upload all required documents before submitting.');
            }
        }

        // Check if application fee has been paid
        if (!$application->hasApplicationFeePaid()) {
            return redirect()->route('student.applications.show', $application)
                ->with('error', 'Please pay the application fee before submitting.');
        }

        $application->update([
            'status' => 'submitted',
            'submission_date' => now(),
        ]);

        // Create status history
        $application->statusHistories()->create([
            'from_status' => 'draft',
            'to_status' => 'submitted',
            'comment' => 'Application submitted by student',
            'changed_by' => auth()->id(),
        ]);

        // Notify student
        $application->user->notify(new ApplicationStatusChanged($application, 'draft', 'Application submitted by student'));

        return redirect()->route('student.applications.show', $application)
            ->with('success', 'Application submitted successfully. You will be notified of any updates.');
    }
}
