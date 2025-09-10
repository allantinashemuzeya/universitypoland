<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'application_id',
        'stripe_payment_intent_id',
        'stripe_charge_id',
        'type',
        'currency',
        'amount',
        'status',
        'metadata',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'metadata' => 'array',
        'paid_at' => 'datetime',
    ];

    /**
     * Get the user that made the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the application associated with the payment.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Scope a query to only include successful payments.
     */
    public function scopeSuccessful($query)
    {
        return $query->where('status', 'succeeded');
    }

    /**
     * Get the amount formatted as a human-readable string with currency code.
     */
    public function getFormattedAmountAttribute(): string
    {
        $amount = number_format($this->amount / 100, 2);
        $currency = strtoupper($this->currency ?? 'USD');
        return $amount . ' ' . $currency;
    }

    /**
     * Check if payment is for application fee.
     */
    public function isApplicationFee(): bool
    {
        return $this->type === 'application_fee';
    }

    /**
     * Check if payment is for commitment fee.
     */
    public function isCommitmentFee(): bool
    {
        return $this->type === 'commitment_fee';
    }
}
