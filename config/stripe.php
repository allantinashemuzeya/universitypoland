<?php

return [
    'key' => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),
    'webhook' => [
        'secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],
    'fees' => [
        'application' => env('APPLICATION_FEE_AMOUNT', 5000), // €50.00 in cents
        'commitment' => env('COMMITMENT_FEE_AMOUNT', 20000), // €200.00 in cents
    ],
    'currency' => 'eur',
];
