<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Document;
use App\Models\Program;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Calculate statistics
        $stats = [
            'totalApplications' => Application::count(),
            'pendingReview' => Application::whereIn('status', ['submitted', 'under_review'])->count(),
            'pendingDocuments' => Document::where('verification_status', 'pending')->count(),
            'activeStudents' => User::where('role', 'student')->count(),
            'newThisWeek' => Application::where('created_at', '>=', now()->subWeek())->count(),
        ];
        
        // Get recent applications
        $recentApplications = Application::with(['user', 'program'])
                                       ->orderBy('created_at', 'desc')
                                       ->limit(5)
                                       ->get();
        
        // Get pending documents with relationships
        $pendingDocuments = Document::with(['application.user'])
                                  ->where('verification_status', 'pending')
                                  ->orderBy('created_at', 'desc')
                                  ->limit(5)
                                  ->get()
                                  ->map(function($doc) {
                                      // Add application_number if not present
                                      if ($doc->application && !$doc->application->application_number) {
                                          $doc->application->application_number = 'APP-' . str_pad($doc->application->id, 6, '0', STR_PAD_LEFT);
                                      }
                                      return $doc;
                                  });
        
        // Get upcoming deadlines
        $upcomingDeadlines = Program::where('is_active', true)
                                  ->where('application_deadline', '>=', now())
                                  ->orderBy('application_deadline', 'asc')
                                  ->limit(5)
                                  ->get();
        
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentApplications' => $recentApplications,
            'pendingDocuments' => $pendingDocuments,
            'upcomingDeadlines' => $upcomingDeadlines,
        ]);
    }
}
