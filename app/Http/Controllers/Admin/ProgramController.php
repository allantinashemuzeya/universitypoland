<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Program::withCount('applications');
        
        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('faculty', 'like', "%{$search}%");
            });
        }
        
        $programs = $query->orderBy('name')->paginate(20);

        return Inertia::render('Admin/Programs/Index', [
            'programs' => $programs,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Programs/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:programs',
            'description' => 'required|string',
            'duration_years' => 'required|numeric|min:1|max:10',
            'degree_type' => 'required|in:bachelor,master,phd,diploma',
            'faculty' => 'required|string|max:255',
            'requirements' => 'required|string',
            'tuition_fee' => 'required|numeric|min:0',
            'application_fee' => 'required|numeric|min:0',
            'application_deadline' => 'required|date|after:today',
            'start_date' => 'required|date|after:application_deadline',
            'is_active' => 'boolean',
            'max_students' => 'required|integer|min:1',
        ]);

        $program = Program::create($validated);

        return redirect()->route('admin.programs.index')
            ->with('success', 'Program created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Program $program)
    {
        $program->loadCount(['applications' => function ($query) {
            $query->selectRaw('count(*) as total, 
                sum(case when status = "submitted" then 1 else 0 end) as submitted,
                sum(case when status = "under_review" then 1 else 0 end) as under_review,
                sum(case when status = "accepted" then 1 else 0 end) as accepted,
                sum(case when status = "rejected" then 1 else 0 end) as rejected,
                sum(case when status = "waitlisted" then 1 else 0 end) as waitlisted');
        }]);

        $recentApplications = $program->applications()
            ->with('user')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Programs/Show', [
            'program' => $program,
            'recentApplications' => $recentApplications,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Program $program)
    {
        return Inertia::render('Admin/Programs/Edit', [
            'program' => $program,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:programs,code,' . $program->id,
            'description' => 'required|string',
            'duration_years' => 'required|numeric|min:1|max:10',
            'degree_type' => 'required|in:bachelor,master,phd,diploma',
            'faculty' => 'required|string|max:255',
            'requirements' => 'required|string',
            'tuition_fee' => 'required|numeric|min:0',
            'application_fee' => 'required|numeric|min:0',
            'application_deadline' => 'required|date',
            'start_date' => 'required|date|after:application_deadline',
            'is_active' => 'boolean',
            'max_students' => 'required|integer|min:1',
        ]);

        $program->update($validated);

        return redirect()->route('admin.programs.show', $program)
            ->with('success', 'Program updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Program $program)
    {
        // Check if program has applications
        if ($program->applications()->exists()) {
            return redirect()->route('admin.programs.index')
                ->with('error', 'Cannot delete program with existing applications.');
        }

        $program->delete();

        return redirect()->route('admin.programs.index')
            ->with('success', 'Program deleted successfully.');
    }

    /**
     * Toggle program active status
     */
    public function toggleActive(Program $program)
    {
        $program->update(['is_active' => !$program->is_active]);

        $status = $program->is_active ? 'activated' : 'deactivated';

        return redirect()->back()
            ->with('success', "Program {$status} successfully.");
    }
}
