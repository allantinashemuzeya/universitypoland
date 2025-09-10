import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Landing({ auth, programs = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const heroImages = [
        'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ];

    const FALLBACKS = {
        hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        generic: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
    };
    
    // Program background images based on degree level and field
    const getProgramImage = (program) => {
        const programImages = {
            bachelor: {
                business: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                engineering: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                medicine: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                computer: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                arts: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                default: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            master: {
                business: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                engineering: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                medicine: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                computer: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                default: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            phd: {
                default: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        };
        
        const name = program.name.toLowerCase();
        const level = program.degree_level;
        
        if (name.includes('business') || name.includes('management') || name.includes('mba')) {
            return programImages[level]?.business || programImages[level]?.default;
        } else if (name.includes('engineering') || name.includes('technology')) {
            return programImages[level]?.engineering || programImages[level]?.default;
        } else if (name.includes('medicine') || name.includes('medical') || name.includes('health')) {
            return programImages[level]?.medicine || programImages[level]?.default;
        } else if (name.includes('computer') || name.includes('software') || name.includes('information')) {
            return programImages[level]?.computer || programImages[level]?.default;
        } else if (name.includes('arts') || name.includes('design')) {
            return programImages[level]?.arts || programImages[level]?.default;
        }
        
        return programImages[level]?.default || programImages.bachelor.default;
    };
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Welcome - Nexus Study | International University Applications" />
            
            <div className="min-h-screen bg-white">
                {/* Navigation */}
                <nav className="bg-white shadow-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-display font-bold text-primary-700">
                                    Nexus Study
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
                <section className="relative h-[600px] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {heroImages.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <img
                                    src={image}
                                    alt="University campus"
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                    decoding="async"
                                    onError={(e) => { e.currentTarget.src = FALLBACKS.hero; e.currentTarget.onerror = null; }}
                                />
                            </div>
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-primary-900/70"></div>
                    </div>
                    {/* Image indicators */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 animate-slide-up">
                                Your Journey to Excellence Starts Here
                            </h2>
                            <p className="text-xl text-gray-200 mb-8 animate-slide-up animation-delay-200">
                                Connect with top universities across Europe and unlock world-class education opportunities. 
                                Perfect for international students from around the globe.
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
                                    <div className="relative h-48">
                                        <img
                                            src={getProgramImage(program)}
                                            alt={`${program.name} banner`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => { e.currentTarget.src = FALLBACKS.generic; e.currentTarget.onerror = null; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end">
                                            <div className="text-white p-6 w-full">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-3xl">
                                                        {program.degree_level === 'bachelor' && '🎓'}
                                                        {program.degree_level === 'master' && '🎯'}
                                                        {program.degree_level === 'phd' && '🔬'}
                                                    </div>
                                                    <div className="text-sm uppercase tracking-wide bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                        {program.degree_level}'s Degree
                                                    </div>
                                                </div>
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
                                    Why Choose Nexus Study?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Nexus Study connects ambitious international students with leading universities 
                                    across Europe. We simplify the application process and provide comprehensive support 
                                    to help you achieve your educational goals in world-renowned institutions.
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
                                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Students studying"
                                    className="rounded-xl shadow-lg"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => { e.currentTarget.src = FALLBACKS.generic; e.currentTarget.onerror = null; }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Application Checklist Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-display font-bold text-dark-900 mb-4">
                                Application Checklist
                            </h3>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Make sure you have everything ready before starting your application
                            </p>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <h4 className="text-2xl font-bold text-dark-900 mb-6">Required Documents</h4>
                                <div className="space-y-4">
                                    {[
                                        'Valid Passport (with at least 6 months validity)',
                                        'Academic Transcripts (translated to English)',
                                        'High School Diploma or Bachelor\'s Degree',
                                        'English Proficiency Certificate (IELTS/TOEFL)',
                                        'Motivation Letter',
                                        'CV/Resume',
                                        'Passport-sized Photographs (4 copies)',
                                        'Financial Proof Documents'
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="bg-primary-100 p-1 rounded-full mr-3 mt-1">
                                                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t">
                                    <Link 
                                        href={route('resources')} 
                                        className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                                    >
                                        Download Full Checklist
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
                                    alt="Documents preparation"
                                    className="rounded-xl shadow-lg"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => { e.currentTarget.src = FALLBACKS.generic; e.currentTarget.onerror = null; }}
                                />
                                <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-lg shadow-lg max-w-xs">
                                    <p className="text-lg font-semibold">Pro Tip:</p>
                                    <p className="mt-2">Start preparing your documents early. Translation and certification can take 2-3 weeks.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Life in Poland Section with Images */}
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
                        
                        {/* Image Gallery */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="relative overflow-hidden rounded-lg shadow-lg h-64">
                                <img
                                    src="https://images.unsplash.com/photo-1519197924294-4ba991a11128?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Warsaw skyline"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => { e.currentTarget.src = FALLBACKS.generic; e.currentTarget.onerror = null; }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                    <h5 className="text-white text-xl font-semibold">Modern Cities</h5>
                                </div>
                            </div>
                            <div className="relative overflow-hidden rounded-lg shadow-lg h-64">
                                <img
                                    src="https://images.unsplash.com/photo-1607977018980-d712e7c36d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
                                    alt="Krakow old town"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => { e.currentTarget.src = FALLBACKS.generic; e.currentTarget.onerror = null; }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                    <h5 className="text-white text-xl font-semibold">Historic Heritage</h5>
                                </div>
                            </div>
                            <div className="relative overflow-hidden rounded-lg shadow-lg h-64">
                                <img
                                    src="https://images.unsplash.com/photo-1543747379-5f2f40e8aa7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Student life"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => { e.currentTarget.src = FALLBACKS.generic; e.currentTarget.onerror = null; }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                    <h5 className="text-white text-xl font-semibold">Vibrant Student Life</h5>
                                </div>
                            </div>
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

                {/* Application Timeline */}
                <section className="py-20 bg-primary-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-display font-bold text-dark-900 mb-4">
                                Your Journey to Europe
                            </h3>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                From application to arrival - we guide you every step of the way
                            </p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-300"></div>
                                
                                {/* Timeline items */}
                                {[
                                    {
                                        step: 1,
                                        title: 'Submit Application',
                                        description: 'Complete online application with required documents',
                                        duration: '1-2 days',
                                        icon: '📝'
                                    },
                                    {
                                        step: 2,
                                        title: 'Document Review',
                                        description: 'Our team reviews and verifies your documents',
                                        duration: '3-5 days',
                                        icon: '🔍'
                                    },
                                    {
                                        step: 3,
                                        title: 'University Application',
                                        description: 'We submit your application to chosen universities',
                                        duration: '2-3 weeks',
                                        icon: '🏛️'
                                    },
                                    {
                                        step: 4,
                                        title: 'Admission Decision',
                                        description: 'Receive your acceptance letter',
                                        duration: '3-4 weeks',
                                        icon: '✅'
                                    },
                                    {
                                        step: 5,
                                        title: 'Visa Application',
                                        description: 'Prepare and submit visa application',
                                        duration: '2-4 weeks',
                                        icon: '📋'
                                    },
                                    {
                                        step: 6,
                                        title: 'Arrival & Orientation',
                                        description: 'Welcome to your new academic journey!',
                                        duration: 'September/October',
                                        icon: '🎉'
                                    }
                                ].map((item, index) => (
                                    <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8 text-right' : 'pr-8'}`}>
                                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                                <div className="text-3xl mb-3">{item.icon}</div>
                                                <h4 className="text-xl font-bold text-dark-900 mb-2">Step {item.step}: {item.title}</h4>
                                                <p className="text-gray-600 mb-2">{item.description}</p>
                                                <span className="text-primary-600 font-medium">{item.duration}</span>
                                            </div>
                                        </div>
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">{item.step}</span>
                                        </div>
                                        <div className="w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resources Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-display font-bold text-dark-900 mb-4">
                                Essential Resources
                            </h3>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Everything you need to prepare for your journey
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Link 
                                href={route('resources')} 
                                className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg hover:shadow-lg transition group"
                            >
                                <div className="text-primary-600 mb-4">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-dark-900 mb-2 group-hover:text-primary-600 transition">Visa Guide</h4>
                                <p className="text-gray-600 text-sm">Step-by-step visa application process and requirements</p>
                            </Link>
                            <Link 
                                href={route('resources')} 
                                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg hover:shadow-lg transition group"
                            >
                                <div className="text-blue-600 mb-4">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-dark-900 mb-2 group-hover:text-blue-600 transition">Housing Guide</h4>
                                <p className="text-gray-600 text-sm">Find the perfect accommodation for your needs</p>
                            </Link>
                            <a 
                                href="#" 
                                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg hover:shadow-lg transition group"
                            >
                                <div className="text-green-600 mb-4">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-dark-900 mb-2 group-hover:text-green-600 transition">Scholarship Info</h4>
                                <p className="text-gray-600 text-sm">Explore funding opportunities and financial aid</p>
                            </a>
                            <a 
                                href="#" 
                                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg hover:shadow-lg transition group"
                            >
                                <div className="text-purple-600 mb-4">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 8.228a4 4 0 015.657 0m0 0l2.475 2.475m-2.475-2.475L8.228 2.571m5.657 5.657L19.542 2.571M12 8v13m0 0l-4-4m4 4l4-4" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-dark-900 mb-2 group-hover:text-purple-600 transition">Career Services</h4>
                                <p className="text-gray-600 text-sm">Post-graduation career support and opportunities</p>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-display font-bold text-dark-900 mb-4">
                                Student Success Stories
                            </h3>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Hear from our students who are living their dreams in Europe
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
                                        alt="Student testimonial"
                                        className="w-16 h-16 rounded-full object-cover mr-4"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => { e.currentTarget.src = FALLBACKS.avatar; e.currentTarget.onerror = null; }}
                                    />
                                    <div>
                                        <h5 className="font-semibold text-dark-900">David Chen</h5>
                                        <p className="text-gray-600 text-sm">Computer Science, Warsaw</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">
                                    "Nexus Study made my dream of studying in Europe a reality. The application process was smooth, and the support team was always there to help."
                                </p>
                                <div className="mt-4 flex text-yellow-400">
                                    {'★'.repeat(5)}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
                                        alt="Student testimonial"
                                        className="w-16 h-16 rounded-full object-cover mr-4"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => { e.currentTarget.src = FALLBACKS.avatar; e.currentTarget.onerror = null; }}
                                    />
                                    <div>
                                        <h5 className="font-semibold text-dark-900">Maria Rodriguez</h5>
                                        <p className="text-gray-600 text-sm">Medicine, Krakow</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">
                                    "The guidance I received was invaluable. From visa application to finding accommodation, Nexus Study was with me every step of the way."
                                </p>
                                <div className="mt-4 flex text-yellow-400">
                                    {'★'.repeat(5)}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
                                        alt="Student testimonial"
                                        className="w-16 h-16 rounded-full object-cover mr-4"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => { e.currentTarget.src = FALLBACKS.avatar; e.currentTarget.onerror = null; }}
                                    />
                                    <div>
                                        <h5 className="font-semibold text-dark-900">Ahmed Hassan</h5>
                                        <p className="text-gray-600 text-sm">Business Admin, Wrocław</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">
                                    "Poland has exceeded all my expectations. Great education, amazing culture, and endless opportunities. Thank you, Nexus Study!"
                                </p>
                                <div className="mt-4 flex text-yellow-400">
                                    {'★'.repeat(5)}
                                </div>
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
                            Join thousands of international students who have successfully started their journey with Nexus Study. 
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
                            <h4 className="text-xl font-display font-bold mb-4">Nexus Study</h4>
                            <p className="text-gray-400">
                                Your Gateway to European Education
                            </p>
                            <p className="text-gray-400 mt-2">
                                Connecting Students Worldwide
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
                                    <li>Email: admissions@nexusstudy.com</li>
                                    <li>Phone: +1 234 567 890</li>
                                    <li>WhatsApp: +1 234 567 890</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                            <p>&copy; 2024 Nexus Study. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
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
