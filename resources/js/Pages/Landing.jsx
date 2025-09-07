import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Landing({ auth, programs = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Welcome - UITM Poland Student Recruitment" />
            
            <div className="min-h-screen bg-white">
                {/* Navigation */}
                <nav className="bg-white shadow-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-display font-bold text-primary-700">
                                    UITM Poland
                                </h1>
                            </div>
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#programs" className="text-dark-700 hover:text-primary-600 transition">Programs</a>
                                <a href="#about" className="text-dark-700 hover:text-primary-600 transition">About</a>
                                <Link href={route('resources')} className="text-dark-700 hover:text-primary-600 transition">Life in Poland</Link>
                                <a href="#apply" className="text-dark-700 hover:text-primary-600 transition">Apply</a>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('login')}
                                            className="text-dark-700 hover:text-primary-600 transition font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition font-medium"
                                        >
                                            Apply Now
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="md:hidden flex items-center">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="text-dark-700"
                                >
                                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
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
                        <div className="md:hidden bg-white border-t">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <a href="#programs" className="block px-3 py-2 text-dark-700 hover:text-primary-600">Programs</a>
                                <a href="#about" className="block px-3 py-2 text-dark-700 hover:text-primary-600">About</a>
                                <a href="#life-in-poland" className="block px-3 py-2 text-dark-700 hover:text-primary-600">Life in Poland</a>
                                <a href="#apply" className="block px-3 py-2 text-dark-700 hover:text-primary-600">Apply</a>
                                {!auth.user && (
                                    <>
                                        <Link href={route('login')} className="block px-3 py-2 text-dark-700 hover:text-primary-600">Login</Link>
                                        <Link href={route('register')} className="block px-3 py-2 bg-primary-600 text-white rounded-lg text-center">Apply Now</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="relative h-[600px] flex items-center">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070"
                            alt="University campus"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-primary-900/70"></div>
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 animate-slide-up">
                                Your Journey to Excellence Starts Here
                            </h2>
                            <p className="text-xl text-gray-200 mb-8 animate-slide-up animation-delay-200">
                                Join UITM Poland and unlock world-class education in the heart of Europe. 
                                Perfect for students from Zimbabwe, Asia, and beyond.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400">
                                <Link
                                    href={route('register')}
                                    className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition inline-block text-center"
                                >
                                    Start Your Application
                                </Link>
                                <a
                                    href="#programs"
                                    className="bg-white text-dark-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block text-center"
                                >
                                    Explore Programs
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-2">15,000+</div>
                                <div className="text-gray-600">Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
                                <div className="text-gray-600">Programs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-2">80+</div>
                                <div className="text-gray-600">Countries</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                                <div className="text-gray-600">Employment Rate</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Programs Section */}
                <section id="programs" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-display font-bold text-dark-900 mb-4">
                                Our Programs
                            </h3>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Choose from our diverse range of internationally recognized degree programs
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {programs.slice(0, 6).map((program) => (
                                <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                    <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                        <div className="text-white text-center">
                                            <div className="text-5xl mb-2">
                                                {program.degree_level === 'bachelor' && '🎓'}
                                                {program.degree_level === 'master' && '🎯'}
                                                {program.degree_level === 'phd' && '🔬'}
                                            </div>
                                            <div className="text-sm uppercase tracking-wide">
                                                {program.degree_level}'s Degree
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-semibold text-dark-900 mb-2">
                                            {program.name}
                                        </h4>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {program.description}
                                        </p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">
                                                {program.duration_years} years
                                            </span>
                                            <span className="text-primary-600 font-semibold">
                                                €{program.tuition_fee_per_year}/year
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Link
                                href={route('register')}
                                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
                            >
                                View All Programs & Apply
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-4xl font-display font-bold text-dark-900 mb-6">
                                    Why Choose UITM Poland?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    The University of Information Technology and Management (UITM) in Poland 
                                    is a leading institution offering world-class education with a global perspective. 
                                    Located in the vibrant city of Rzeszów, we provide an ideal environment for 
                                    international students to thrive academically and culturally.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-primary-100 p-3 rounded-lg mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-dark-900 mb-1">EU-Recognized Degrees</h4>
                                            <p className="text-gray-600">Your qualification is recognized across Europe and worldwide</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-primary-100 p-3 rounded-lg mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-dark-900 mb-1">Affordable Education</h4>
                                            <p className="text-gray-600">Quality education at competitive tuition fees with scholarship opportunities</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-primary-100 p-3 rounded-lg mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-dark-900 mb-1">English-Taught Programs</h4>
                                            <p className="text-gray-600">All international programs are conducted entirely in English</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <img
                                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070"
                                    alt="Students studying"
                                    className="rounded-xl shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Life in Poland Section */}
                <section id="life-in-poland" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-display font-bold text-dark-900 mb-4">
                                Life in Poland
                            </h3>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Discover what awaits you in one of Europe's most dynamic countries
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">🏛️</span>
                                </div>
                                <h4 className="text-xl font-semibold text-dark-900 mb-2">Rich Culture</h4>
                                <p className="text-gray-600">Experience centuries of history and vibrant modern culture</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">💰</span>
                                </div>
                                <h4 className="text-xl font-semibold text-dark-900 mb-2">Affordable Living</h4>
                                <p className="text-gray-600">Low cost of living compared to Western European countries</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">🚄</span>
                                </div>
                                <h4 className="text-xl font-semibold text-dark-900 mb-2">Easy Travel</h4>
                                <p className="text-gray-600">Central location perfect for exploring Europe</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">👥</span>
                                </div>
                                <h4 className="text-xl font-semibold text-dark-900 mb-2">Student Community</h4>
                                <p className="text-gray-600">Join a diverse international student community</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="apply" className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-4xl font-display font-bold text-white mb-6">
                            Ready to Start Your Journey?
                        </h3>
                        <p className="text-xl text-primary-100 mb-8">
                            Join thousands of international students who have chosen UITM Poland for their education. 
                            Apply now and take the first step towards your future.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route('register')}
                                className="bg-white text-primary-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
                            >
                                Apply Now
                            </Link>
                            <a
                                href="#programs"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-700 transition inline-block"
                            >
                                View Programs
                            </a>
                        </div>
                        <p className="mt-8 text-primary-100">
                            Applications are open for 2024/2025 academic year
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-dark-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <h4 className="text-xl font-display font-bold mb-4">UITM Poland</h4>
                                <p className="text-gray-400">
                                    University of Information Technology and Management
                                </p>
                                <p className="text-gray-400 mt-2">
                                    Rzeszów, Poland
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#programs" className="hover:text-white transition">Programs</a></li>
                                    <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                                    <li><a href="#life-in-poland" className="hover:text-white transition">Life in Poland</a></li>
                                    <li><Link href={route('register')} className="hover:text-white transition">Apply</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">For Students</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><Link href={route('login')} className="hover:text-white transition">Student Portal</Link></li>
                                    <li><a href="#" className="hover:text-white transition">Admission Requirements</a></li>
                                    <li><a href="#" className="hover:text-white transition">Scholarships</a></li>
                                    <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>Email: admissions@uitm.pl</li>
                                    <li>Phone: +48 123 456 789</li>
                                    <li>WhatsApp: +48 987 654 321</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                            <p>&copy; 2024 UITM Poland. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            <style jsx>{`
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .animation-delay-200 {
                    animation-delay: 200ms;
                }
                .animation-delay-400 {
                    animation-delay: 400ms;
                }
            `}</style>
        </>
    );
}
