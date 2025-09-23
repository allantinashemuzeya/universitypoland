<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page
     */
    public function index()
    {
        $fees = Setting::getGroup('fees');
        
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'fees' => $fees,
            ],
        ]);
    }

    /**
     * Update fee settings
     */
    public function updateFees(Request $request)
    {
        $request->validate([
            'application_fee_amount' => 'required|integer|min:0',
            'commitment_fee_amount' => 'required|integer|min:0',
        ]);

        // Update application fee
        Setting::set('application_fee_amount', $request->application_fee_amount);
        
        // Update commitment fee
        Setting::set('commitment_fee_amount', $request->commitment_fee_amount);

        return redirect()->route('admin.settings.index')
            ->with('success', 'Fee settings updated successfully.');
    }
}