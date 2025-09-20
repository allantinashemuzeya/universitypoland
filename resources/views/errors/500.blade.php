<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Server Error - {{ config('app.name', 'UITM Recruitment') }}</title>
    @vite(['resources/css/app.css'])
</head>
<body class="antialiased bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="max-w-xl w-full px-6">
            <div class="text-center">
                <h1 class="text-9xl font-bold text-gray-200">500</h1>
                <p class="text-2xl font-semibold text-gray-800 mt-4">Server Error</p>
                <p class="text-gray-600 mt-2">Something went wrong on our servers. We're working to fix it.</p>
                <div class="mt-6 space-x-4">
                    <a href="{{ url('/') }}" class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Go Home
                    </a>
                    <button onclick="window.location.reload()" class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>