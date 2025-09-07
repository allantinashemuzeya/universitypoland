<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'degree_level',
        'degree_type',
        'duration_years',
        'faculty',
        'language_of_instruction',
        'tuition_fee_per_year',
        'tuition_fee',
        'application_fee',
        'requirements',
        'application_deadline',
        'start_date',
        'is_active',
        'max_students',
    ];

    protected $casts = [
        'application_deadline' => 'date',
        'start_date' => 'date',
        'is_active' => 'boolean',
        'tuition_fee_per_year' => 'decimal:2',
    ];

    /**
     * Get applications for this program
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Get only active programs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get programs with upcoming deadlines
     */
    public function scopeUpcomingDeadlines($query)
    {
        return $query->where('application_deadline', '>=', now())
                     ->orderBy('application_deadline', 'asc');
    }
}
