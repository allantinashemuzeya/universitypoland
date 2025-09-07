# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Initial Setup
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

### Database Operations
```bash
php artisan migrate:fresh --seed    # Reset DB with seed data
php artisan migrate                  # Run pending migrations
php artisan db:seed                  # Seed database
```

### Development Server
```bash
composer dev                         # Runs all services concurrently (server, queue, logs, vite)
# OR run separately:
php artisan serve                    # Laravel server (port 8000)
npm run dev                         # Vite dev server with HMR
php artisan queue:listen --tries=1  # Queue worker
php artisan pail                    # Real-time log viewer
```

### Code Quality & Testing
```bash
php artisan pint                    # Format PHP code (Laravel Pint)
php artisan test                    # Run PHPUnit tests
php artisan test --filter=Feature   # Run feature tests only
php artisan test tests/Unit/ExampleTest.php  # Run specific test
```

### Build for Production
```bash
npm run build                       # Build frontend assets
php artisan optimize                # Optimize Laravel
```

## Architecture Overview

### Stack
- **Backend**: Laravel 12 with Inertia.js SSR
- **Frontend**: React 18 with Tailwind CSS
- **Database**: MySQL/SQLite
- **Build Tool**: Vite
- **Auth**: Laravel Breeze with role-based access (admin/student)

### Directory Structure
```
app/
├── Http/
│   └── Controllers/
│       ├── Admin/              # Admin-specific controllers
│       ├── Student/            # Student-specific controllers
│       └── Auth/              # Authentication controllers
├── Models/                    # Eloquent models
│   ├── Application.php        # Student applications
│   ├── Program.php           # Academic programs
│   ├── Document.php          # Uploaded documents
│   └── Communication.php     # Messages between admin/students
└── Notifications/            # Email notifications

resources/js/
├── Pages/
│   ├── Admin/               # Admin dashboard & views
│   ├── Student/             # Student dashboard & views
│   ├── Auth/               # Auth pages (login, register)
│   └── Landing.jsx         # Public landing page
├── Layouts/                # Shared layouts
└── Components/             # Reusable React components
```

### Data Flow
1. **Routes** (`routes/web.php`) define endpoints with middleware
2. **Controllers** handle requests, authorize actions, prepare data
3. **Inertia** renders React components with server-side data
4. **React Pages** receive props and handle UI interactions
5. **Ziggy** provides route helpers in JavaScript

## Key Information from README

### Default User Credentials
```
Admin Users:
- admin@uitm.pl / password
- admissions@uitm.pl / password

Student Users:
- john.mukamuri@example.com / password
- sarah.chigumba@example.com / password
```

### Core Features
- **Students**: Browse programs, submit applications, upload documents, track progress
- **Admins**: Review applications, verify documents, send notifications, generate reports
- **Theme**: Red (#dc2626) & Black (#171717) with Inter/Montserrat fonts

## Laravel 12 + Inertia.js + React Specifics

### Inertia Page Props
Controllers pass data via Inertia::render():
```php
return Inertia::render('Student/Dashboard', [
    'applications' => $applications,
    'recentCommunications' => $recentCommunications,
]);
```

### Frontend Route Generation
Use Ziggy for named routes in React:
```jsx
import { route } from '@/ziggy';
<Link href={route('student.applications.show', application.id)}>
```

### Shared Data
Global data available to all pages via `HandleInertiaRequests` middleware

### Form Handling
Use Inertia's `useForm` hook for server-side validation:
```jsx
const { data, setData, post, processing, errors } = useForm({...});
```

## Important Routes

### Public Routes
- `/` - Landing page with program showcase
- `/resources` - Life in Poland resources

### Authenticated Routes
- `/dashboard` - Role-based redirect to admin or student dashboard
- `/profile` - User profile management

### Student Routes (prefix: /student)
- `/student/dashboard` - Student dashboard with applications overview
- `/student/applications` - Application CRUD operations
- `/student/documents` - Document management
- `/student/communications/{id}` - View messages

### Admin Routes (prefix: /admin)
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/applications` - Manage all applications
- `/admin/programs` - Manage academic programs
- `/admin/users` - User management
- `/admin/documents/pending` - Review pending documents
- `/admin/reports` - Generate reports

### Role-Based Access
- Middleware `auth` and `verified` protect authenticated routes
- Dashboard redirects based on user role (admin/student)
- Admin routes require admin role (enforced in controllers)
