<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page Not Found - {{ config('app.name', 'UITM Recruitment') }}</title>
    @vite(['resources/css/app.css'])
</head>
<body class="antialiased bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="max-w-xl w-full px-6">
            <div class="text-center">
                <h1 class="text-9xl font-bold text-gray-200">404</h1>
                <p class="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</p>
                <p class="text-gray-600 mt-2">The page you are looking for doesn't exist or has been moved.</p>
                <div class="mt-6">
                    <a href="{{ url('/') }}" class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>