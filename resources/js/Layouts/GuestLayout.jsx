import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">U</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">UITM Poland</h1>
                            <p className="text-xs text-gray-600">Student Recruitment System</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
                    {children}
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} University of Information Technology and Management
                </p>
            </div>
        </div>
    );
}
