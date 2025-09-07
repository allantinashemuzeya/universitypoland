<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Communication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $applications = Application::where('user_id', $user->id)
                                 ->with(['program', 'documents'])
                                 ->orderBy('created_at', 'desc')
                                 ->get();
        
        $recentCommunications = Communication::where('recipient_id', $user->id)
                                           ->with(['sender', 'application'])
                                           ->orderBy('created_at', 'desc')
                                           ->limit(10)
                                           ->get();
        
        return Inertia::render('Student/Dashboard', [
            'applications' => $applications,
            'recentCommunications' => $recentCommunications,
        ]);
    }
}
