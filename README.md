# UITM Poland Student Recruitment System

A comprehensive web application for managing student applications to the University of Information Technology and Management (UITM) in Poland. Built with Laravel, React, and Inertia.js.

## Features

### For Students
- 🎓 Browse available programs
- 📝 Submit applications online
- 📄 Upload required documents
- 📊 Track application progress
- 💬 Communicate with admissions office
- 📚 Access resources about life in Poland

### For Administrators
- 📋 Review and manage applications
- 📧 Send automated email notifications
- 📑 Verify uploaded documents
- 📊 Generate reports and statistics
- 👥 Manage student accounts
- 🎯 Track program deadlines

## Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React with Inertia.js
- **Styling**: Tailwind CSS (Red & Black theme)
- **Database**: MySQL/SQLite
- **Email**: SMTP/Mailtrap
- **Authentication**: Laravel Breeze

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/uitm-recruitment.git
cd uitm-recruitment
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node dependencies:
```bash
npm install
```

4. Copy environment file and configure:
```bash
cp .env.example .env
php artisan key:generate
```

5. Configure your database in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=uitm_recruitment
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations and seeders:
```bash
php artisan migrate:fresh --seed
```

7. Build assets:
```bash
npm run build
```

8. Start the development server:
```bash
php artisan serve
```

9. In another terminal, start Vite:
```bash
npm run dev
```

## Default Users

After seeding, you can login with:

### Admin Users
- Email: `admin@uitm.pl`
- Password: `password`

- Email: `admissions@uitm.pl`
- Password: `password`

### Sample Student Users
- Email: `john.mukamuri@example.com`
- Password: `password`

- Email: `sarah.chigumba@example.com`
- Password: `password`

## Key Features Implementation

### 🏠 Landing Page
- Hero section with call-to-action
- Program showcase
- Statistics display
- About UITM section
- Life in Poland resources
- Responsive design with mobile menu

### 👨‍🎓 Student Dashboard
- Application overview
- Progress tracking
- Document upload status
- Message center
- Quick action buttons

### 👨‍💼 Admin Dashboard
- Statistics overview
- Recent applications
- Pending documents
- Upcoming deadlines
- Quick navigation to key sections

### 📧 Email Notifications
- Application status changes
- Document verification updates
- New communications
- Automated reminders

### 🎨 Theme
- Primary color: Red (#dc2626)
- Secondary color: Black (#171717)
- Typography: Inter & Montserrat fonts
- Consistent design language throughout

## Project Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   └── Student/
│   │   └── Middleware/
│   ├── Models/
│   └── Notifications/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Admin/
│   │   │   ├── Student/
│   │   │   └── Landing.jsx
│   │   └── Layouts/
│   └── css/
├── routes/
│   └── web.php
└── tailwind.config.js
```

## Future Enhancements

- [ ] Multi-language support
- [ ] Payment integration for application fees
- [ ] Video interview scheduling
- [ ] Mobile app
- [ ] Advanced analytics dashboard
- [ ] Automated document verification
- [ ] WhatsApp integration
- [ ] Virtual campus tour

## Contributing

Please follow the standard Git flow:
1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is proprietary software for UITM Poland.

## Support

For technical support, contact: tech@uitm.pl
