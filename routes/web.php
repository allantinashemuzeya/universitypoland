<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [LandingController::class, 'index'])->name('home');
Route::get('/resources', function () {
    return Inertia::render('Resources');
})->name('resources');

// Role-based dashboard redirects
Route::get('/dashboard', function () {
    $user = auth()->user();
    return redirect()->route($user->role === 'admin' ? 'admin.dashboard' : 'student.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Student routes
Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
    
    // Applications
    Route::post('/applications/{application}/submit', [\App\Http\Controllers\Student\ApplicationController::class, 'submit'])->name('applications.submit');
    Route::resource('applications', \App\Http\Controllers\Student\ApplicationController::class);
    
    // Documents
    Route::get('/documents', [\App\Http\Controllers\Student\DocumentController::class, 'index'])->name('documents');
    Route::post('/documents', [\App\Http\Controllers\Student\DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}', [\App\Http\Controllers\Student\DocumentController::class, 'show'])->name('documents.show');
    Route::delete('/documents/{document}', [\App\Http\Controllers\Student\DocumentController::class, 'destroy'])->name('documents.destroy');
    
    // Communications
    Route::get('/communications/{communication}', [\App\Http\Controllers\Student\CommunicationController::class, 'show'])->name('communications.show');
    Route::post('/communications/{communication}/reply', [\App\Http\Controllers\Student\CommunicationController::class, 'reply'])->name('communications.reply');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Applications
    Route::resource('applications', \App\Http\Controllers\Admin\ApplicationController::class)->except(['create', 'store', 'edit', 'update']);
    Route::post('/applications/{application}/status', [\App\Http\Controllers\Admin\ApplicationController::class, 'updateStatus'])->name('applications.updateStatus');
    Route::post('/applications/{application}/note', [\App\Http\Controllers\Admin\ApplicationController::class, 'addNote'])->name('applications.addNote');
    Route::get('/applications/export', [\App\Http\Controllers\Admin\ApplicationController::class, 'export'])->name('applications.export');
    
    // Programs
    Route::resource('programs', \App\Http\Controllers\Admin\ProgramController::class);
    Route::post('/programs/{program}/toggle-active', [\App\Http\Controllers\Admin\ProgramController::class, 'toggleActive'])->name('programs.toggleActive');
    
    // Users
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    Route::post('/users/{user}/reset-password', [\App\Http\Controllers\Admin\UserController::class, 'resetPassword'])->name('users.resetPassword');
    Route::post('/users/{user}/toggle-active', [\App\Http\Controllers\Admin\UserController::class, 'toggleActive'])->name('users.toggleActive');
    
    // Documents
    Route::get('/documents/pending', [\App\Http\Controllers\Admin\DocumentController::class, 'pending'])->name('documents.pending');
    Route::get('/documents/{document}/review', [\App\Http\Controllers\Admin\DocumentController::class, 'review'])->name('documents.review');
    Route::post('/documents/{document}/status', [\App\Http\Controllers\Admin\DocumentController::class, 'updateStatus'])->name('documents.updateStatus');
    Route::get('/documents/{document}/download', [\App\Http\Controllers\Admin\DocumentController::class, 'download'])->name('documents.download');
    Route::get('/documents/{document}/view', [\App\Http\Controllers\Admin\DocumentController::class, 'view'])->name('documents.view');
    Route::post('/documents/bulk-approve', [\App\Http\Controllers\Admin\DocumentController::class, 'bulkApprove'])->name('documents.bulkApprove');
    Route::post('/documents/bulk-reject', [\App\Http\Controllers\Admin\DocumentController::class, 'bulkReject'])->name('documents.bulkReject');
    
    // Reports
    Route::get('/reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports');
    Route::get('/reports/applications', [\App\Http\Controllers\Admin\ReportController::class, 'applications'])->name('reports.applications');
    Route::get('/reports/export', [\App\Http\Controllers\Admin\ReportController::class, 'export'])->name('reports.export');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
