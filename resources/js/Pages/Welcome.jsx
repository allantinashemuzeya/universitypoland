import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Nexus Study - Your Gateway to Education in Poland" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <h1 className="text-3xl font-bold text-gray-900">Nexus Study</h1>
                            </div>
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                                        >
                                            Apply Now
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                                Your Gateway to Education in Poland
                            </h1>
                            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
                                Join thousands of international students pursuing their dreams at top Polish universities
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route('register')}
                                    className="inline-block px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Start Your Application
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-block px-8 py-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition-colors"
                                >
                                    Check Application Status
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Why Choose Nexus Study?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We make your journey to studying in Poland simple and straightforward
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    World-Class Education
                                </h3>
                                <p className="text-gray-600">
                                    Access to top-ranked Polish universities with internationally recognized degrees
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Affordable Tuition
                                </h3>
                                <p className="text-gray-600">
                                    Competitive tuition fees and living costs compared to other European countries
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Full Support
                                </h3>
                                <p className="text-gray-600">
                                    Comprehensive assistance throughout your application and visa process
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    EU Opportunities
                                </h3>
                                <p className="text-gray-600">
                                    Study in the heart of Europe with access to the entire EU job market
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Application Process */}
                <section className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Simple Application Process
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Get started in just a few steps
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    1
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Create Your Account
                                </h3>
                                <p className="text-gray-600">
                                    Register with your basic information and select your preferred programs
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    2
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Submit Documents
                                </h3>
                                <p className="text-gray-600">
                                    Upload your academic records, passport, and other required documents
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    3
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Track Your Application
                                </h3>
                                <p className="text-gray-600">
                                    Monitor your application status and receive updates in real-time
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href={route('register')}
                                className="inline-block px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Start Your Application Now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Nexus Study</h3>
                                <p className="text-gray-400">
                                    Your trusted partner for studying in Poland
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href={route('register')} className="text-gray-400 hover:text-white">
                                            Apply Now
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('login')} className="text-gray-400 hover:text-white">
                                            Check Status
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>Email: info@nexusstudy.com</li>
                                    <li>Phone: +48 123 456 789</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                                <p className="text-gray-400">
                                    Stay updated with the latest news and opportunities
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 Nexus Study. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
