import { Link } from '@inertiajs/react';
import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { ChevronDown } from 'lucide-react';

export default function PublicLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="h-10 w-auto text-primary-600" />
                                <span className="ml-3 text-2xl font-display font-bold text-dark-900">
                                    Nexus Study
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-primary-600 transition font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="/resources"
                                className="text-gray-700 hover:text-primary-600 transition font-medium"
                            >
                                Life in Poland
                            </Link>
                            <Link
                                href="/login"
                                className="text-gray-700 hover:text-primary-600 transition font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
                            >
                                Apply Now
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-700 hover:text-primary-600 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {mobileMenuOpen ? (
                                        <path d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link
                                href="/"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                            >
                                Home
                            </Link>
                            <Link
                                href="/resources"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                            >
                                Life in Poland
                            </Link>
                            <Link
                                href="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                            >
                                Apply Now
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-dark-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4">About Nexus Study</h3>
                            <p className="text-gray-400">
                                Your trusted partner for education in Europe. We help students achieve their dreams of studying abroad.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                                <li><Link href="/resources" className="hover:text-white transition">Resources</Link></li>
                                <li><Link href="/login" className="hover:text-white transition">Student Portal</Link></li>
                                <li><Link href="/register" className="hover:text-white transition">Apply Now</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Resources</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/resources#visa" className="hover:text-white transition">Visa Process</Link></li>
                                <li><Link href="/resources#living" className="hover:text-white transition">Living in Poland</Link></li>
                                <li><Link href="/resources#student-life" className="hover:text-white transition">Student Life</Link></li>
                                <li><Link href="/resources#faq" className="hover:text-white transition">FAQs</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Email: info@nexusstudy.com</li>
                                <li>Phone: +1 234 567 890</li>
                                <li>WhatsApp: +1 234 567 890</li>
                                <li>Office: Mon-Fri 9:00-17:00 CET</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Nexus Study. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
