<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        $programs = Program::active()
                         ->upcomingDeadlines()
                         ->get();

        return Inertia::render('Landing', [
            'programs' => $programs,
        ]);
    }
}
