<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Program;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display reports dashboard
     */
    public function index()
    {
        // Application statistics
        $applicationStats = Application::selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN status = "draft" THEN 1 ELSE 0 END) as draft,
            SUM(CASE WHEN status = "submitted" THEN 1 ELSE 0 END) as submitted,
            SUM(CASE WHEN status = "under_review" THEN 1 ELSE 0 END) as under_review,
            SUM(CASE WHEN status = "accepted" THEN 1 ELSE 0 END) as accepted,
            SUM(CASE WHEN status = "rejected" THEN 1 ELSE 0 END) as rejected,
            SUM(CASE WHEN status = "waitlisted" THEN 1 ELSE 0 END) as waitlisted
        ')->first();

        // Applications by program
        $applicationsByProgram = Program::withCount('applications')
            ->orderBy('applications_count', 'desc')
            ->get();

        // Applications over time (last 30 days)
        $applicationsOverTime = Application::where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top countries
        $topCountries = Application::selectRaw('country, COUNT(*) as count')
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // User statistics
        $userStats = User::selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN role = "admin" THEN 1 ELSE 0 END) as admins,
            SUM(CASE WHEN role = "student" THEN 1 ELSE 0 END) as students
        ')->first();

        // Recent activity
        $recentActivity = DB::table('application_status_histories')
            ->join('applications', 'application_status_histories.application_id', '=', 'applications.id')
            ->join('users', 'application_status_histories.changed_by', '=', 'users.id')
            ->select(
                'application_status_histories.*',
                'applications.first_name',
                'applications.last_name',
                'users.name as changed_by_name'
            )
            ->orderBy('application_status_histories.created_at', 'desc')
            ->limit(20)
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'applicationStats' => $applicationStats,
            'applicationsByProgram' => $applicationsByProgram,
            'applicationsOverTime' => $applicationsOverTime,
            'topCountries' => $topCountries,
            'userStats' => $userStats,
            'recentActivity' => $recentActivity,
        ]);
    }

    /**
     * Generate detailed application report
     */
    public function applications(Request $request)
    {
        $query = Application::with(['user', 'program']);

        // Date range filter
        if ($request->has('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }

        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Program filter
        if ($request->has('program_id') && $request->program_id !== 'all') {
            $query->where('program_id', $request->program_id);
        }

        $applications = $query->orderBy('created_at', 'desc')->get();

        // Generate summary statistics
        $summary = [
            'total' => $applications->count(),
            'by_status' => $applications->groupBy('status')->map->count(),
            'by_program' => $applications->groupBy('program.name')->map->count(),
            'by_country' => $applications->groupBy('country')->map->count()->sortDesc()->take(10),
        ];

        $programs = Program::orderBy('name')->get();

        return Inertia::render('Admin/Reports/Applications', [
            'applications' => $applications,
            'summary' => $summary,
            'programs' => $programs,
            'filters' => $request->only(['start_date', 'end_date', 'status', 'program_id']),
        ]);
    }

    /**
     * Export report to CSV
     */
    public function export(Request $request)
    {
        $type = $request->get('type', 'applications');

        switch ($type) {
            case 'applications':
                return $this->exportApplications($request);
            case 'users':
                return $this->exportUsers($request);
            case 'programs':
                return $this->exportPrograms($request);
            default:
                abort(404, 'Invalid export type');
        }
    }

    private function exportApplications(Request $request)
    {
        $query = Application::with(['user', 'program']);

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->has('program_id') && $request->program_id !== 'all') {
            $query->where('program_id', $request->program_id);
        }
        if ($request->has('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }

        $applications = $query->get();

        $csv = "ID,Name,Email,Phone,Country,Program,Status,Submission Date,Created At\n";
        
        foreach ($applications as $app) {
            $csv .= "{$app->id},";
            $csv .= "\"{$app->first_name} {$app->last_name}\",";
            $csv .= "{$app->email},";
            $csv .= "{$app->phone},";
            $csv .= "{$app->country},";
            $csv .= "\"{$app->program->name}\",";
            $csv .= "{$app->status},";
            $csv .= ($app->submission_date ? $app->submission_date->format('Y-m-d') : 'Not submitted') . ",";
            $csv .= "{$app->created_at->format('Y-m-d H:i:s')}\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="applications-report-' . now()->format('Y-m-d') . '.csv"');
    }

    private function exportUsers(Request $request)
    {
        $users = User::withCount('applications')->get();

        $csv = "ID,Name,Email,Role,Applications,Verified,Created At\n";
        
        foreach ($users as $user) {
            $csv .= "{$user->id},";
            $csv .= "\"{$user->name}\",";
            $csv .= "{$user->email},";
            $csv .= "{$user->role},";
            $csv .= "{$user->applications_count},";
            $csv .= ($user->email_verified_at ? 'Yes' : 'No') . ",";
            $csv .= "{$user->created_at->format('Y-m-d H:i:s')}\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="users-report-' . now()->format('Y-m-d') . '.csv"');
    }

    private function exportPrograms(Request $request)
    {
        $programs = Program::withCount('applications')->get();

        $csv = "ID,Name,Code,Degree Type,Faculty,Applications,Active,Application Deadline,Start Date\n";
        
        foreach ($programs as $program) {
            $csv .= "{$program->id},";
            $csv .= "\"{$program->name}\",";
            $csv .= "{$program->code},";
            $csv .= "{$program->degree_type},";
            $csv .= "\"{$program->faculty}\",";
            $csv .= "{$program->applications_count},";
            $csv .= ($program->is_active ? 'Yes' : 'No') . ",";
            $csv .= "{$program->application_deadline->format('Y-m-d')},";
            $csv .= "{$program->start_date->format('Y-m-d')}\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="programs-report-' . now()->format('Y-m-d') . '.csv"');
    }
}
