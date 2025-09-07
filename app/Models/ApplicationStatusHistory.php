<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicationStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'from_status',
        'to_status',
        'comment',
        'changed_by',
    ];

    /**
     * Get the application that owns this history
     */
    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the user who made the status change
     */
    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
