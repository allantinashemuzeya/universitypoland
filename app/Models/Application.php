<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_number',
        'user_id',
        'program_id',
        'status',
        'first_name',
        'last_name',
        'date_of_birth',
        'nationality',
        'passport_number',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'postal_code',
        'education_level',
        'institution_name',
        'graduation_year',
        'gpa',
        'english_proficiency',
        'english_test_score',
        'motivation_letter',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'submission_date',
        'reviewed_at',
        'reviewed_by',
        'review_notes',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'submission_date' => 'datetime',
        'reviewed_at' => 'datetime',
        'graduation_year' => 'integer',
        'gpa' => 'decimal:2',
    ];

    /**
     * Boot function to generate application number
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($application) {
            $application->application_number = 'APP-' . date('Y') . '-' . strtoupper(Str::random(6));
        });
    }

    /**
     * Get the user who owns the application
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the program for this application
     */
    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    /**
     * Get the admin who reviewed the application
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get documents for this application
     */
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Get status history for this application
     */
    public function statusHistories()
    {
        return $this->hasMany(ApplicationStatusHistory::class);
    }

    /**
     * Get communications for this application
     */
    public function communications()
    {
        return $this->hasMany(Communication::class);
    }

    /**
     * Check if application is editable
     */
    public function isEditable(): bool
    {
        return in_array($this->status, ['draft', 'documents_requested']);
    }

    /**
     * Get progress percentage
     */
    public function getProgressPercentage(): int
    {
        $statuses = ['draft', 'submitted', 'under_review', 'documents_requested', 'approved', 'rejected', 'withdrawn'];
        $currentIndex = array_search($this->status, $statuses);
        
        if ($this->status === 'rejected' || $this->status === 'withdrawn') {
            return 100;
        }
        
        return ($currentIndex / 4) * 100; // 4 main steps to approval
    }
}
