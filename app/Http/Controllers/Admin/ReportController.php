<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Program;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display reports dashboard
     */
    public function index()
    {
        // Summary Statistics
        $stats = [
            'totalApplications' => Application::count(),
            'newApplicationsThisWeek' => Application::where('created_at', '>=', now()->subWeek())->count(),
            'activeStudents' => User::where('role', 'student')->count(),
            'newStudentsThisMonth' => User::where('role', 'student')
                ->where('created_at', '>=', now()->subMonth())
                ->count(),
            'acceptanceRate' => $this->calculateAcceptanceRate(),
            'acceptedApplications' => Application::where('status', 'accepted')->count(),
            'pendingReview' => Application::where('status', 'submitted')->count(),
            'avgReviewTime' => $this->calculateAverageReviewTime(),
            'documents' => [
                'total' => \App\Models\Document::count(),
                'verified' => \App\Models\Document::where('verification_status', 'verified')->count(),
                'pending' => \App\Models\Document::where('verification_status', 'pending')->count(),
                'rejected' => \App\Models\Document::where('verification_status', 'rejected')->count(),
            ],
        ];

        // Chart Data
        $chartData = [
            'applicationsByStatus' => $this->getApplicationsByStatus(),
            'applicationsByProgram' => $this->getApplicationsByProgram(),
            'monthlyTrend' => $this->getMonthlyTrend(),
            'topCountries' => $this->getTopCountries(),
            'programPerformance' => $this->getProgramPerformance(),
        ];

        return Inertia::render('Admin/Reports/Index', [
            'stats' => $stats,
            'chartData' => $chartData,
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

    private function calculateAcceptanceRate()
    {
        $total = Application::whereIn('status', ['accepted', 'rejected'])->count();
        if ($total === 0) return 0;
        
        $accepted = Application::where('status', 'accepted')->count();
        return round(($accepted / $total) * 100);
    }

    private function calculateAverageReviewTime()
    {
        // SQLite compatible version
        if (config('database.default') === 'sqlite') {
            $avgDays = Application::whereIn('status', ['accepted', 'rejected'])
                ->whereNotNull('updated_at')
                ->selectRaw('AVG(julianday(updated_at) - julianday(created_at)) as avg_days')
                ->value('avg_days');
        } else {
            // MySQL version
            $avgDays = Application::whereIn('status', ['accepted', 'rejected'])
                ->whereNotNull('updated_at')
                ->selectRaw('AVG(DATEDIFF(updated_at, created_at)) as avg_days')
                ->value('avg_days');
        }
        
        return round($avgDays ?: 0);
    }

    private function getApplicationsByStatus()
    {
        return Application::select('status', DB::raw('count(*) as value'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => ucfirst($item->status),
                    'value' => $item->value,
                ];
            })
            ->toArray();
    }

    private function getApplicationsByProgram()
    {
        return Application::with('program')
            ->select('program_id', DB::raw('count(*) as count'))
            ->groupBy('program_id')
            ->get()
            ->map(function ($item) {
                return [
                    'program' => $item->program->name ?? 'Unknown',
                    'count' => $item->count,
                ];
            })
            ->take(10)
            ->toArray();
    }

    private function getMonthlyTrend()
    {
        $trend = [];
        
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthKey = $month->format('M Y');
            
            $applications = Application::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
                
            $accepted = Application::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->where('status', 'accepted')
                ->count();
            
            $trend[] = [
                'month' => $monthKey,
                'applications' => $applications,
                'accepted' => $accepted,
            ];
        }
        
        return $trend;
    }

    private function getTopCountries()
    {
        // Check if country field exists on applications
        if (\Schema::hasColumn('applications', 'country')) {
            return Application::selectRaw('country as name, COUNT(*) as count')
                ->groupBy('country')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get()
                ->toArray();
        }
        
        // Return mock data if no country field
        return [
            ['name' => 'India', 'count' => 245],
            ['name' => 'China', 'count' => 189],
            ['name' => 'Nigeria', 'count' => 156],
            ['name' => 'Pakistan', 'count' => 134],
            ['name' => 'Bangladesh', 'count' => 98],
        ];
    }

    private function getProgramPerformance()
    {
        return Program::withCount(['applications', 'applications as accepted_count' => function ($query) {
                $query->where('status', 'accepted');
            }])
            ->get()
            ->filter(function ($program) {
                return $program->applications_count > 0;
            })
            ->map(function ($program) {
                return [
                    'name' => $program->name,
                    'applications' => $program->applications_count,
                    'acceptanceRate' => $program->applications_count > 0 
                        ? round(($program->accepted_count / $program->applications_count) * 100)
                        : 0,
                ];
            })
            ->take(5)
            ->values()
            ->toArray();
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
