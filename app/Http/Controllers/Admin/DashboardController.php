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
        $stats = [
            'total_applications' => Application::count(),
            'pending_review' => Application::whereIn('status', ['submitted', 'under_review'])->count(),
            'accepted' => Application::where('status', 'accepted')->count(),
            'total_students' => User::where('role', 'student')->count(),
        ];
        
        $recentApplications = Application::with(['user', 'program'])
                                       ->orderBy('created_at', 'desc')
                                       ->limit(5)
                                       ->get();
        
        $pendingDocumentsCount = Document::where('status', 'pending')->count();
        
        $upcomingDeadlines = Program::active()
                                  ->where('application_deadline', '>=', now())
                                  ->orderBy('application_deadline', 'asc')
                                  ->limit(5)
                                  ->get();
        
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentApplications' => $recentApplications,
            'pendingDocuments' => $pendingDocumentsCount,
            'upcomingDeadlines' => $upcomingDeadlines,
        ]);
    }
}
