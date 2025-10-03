import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Resources() {
    const sections = [
        {
            title: "Living in Poland",
            icon: "🏠",
            items: [
                { title: "Accommodation", content: "Student dormitories available from €150-300/month. Private apartments from €400-800/month." },
                { title: "Cost of Living", content: "Average monthly expenses: €500-700 including food, transport, and entertainment." },
                { title: "Healthcare", content: "EU health insurance card accepted. Private insurance available for €30-50/month." },
                { title: "Transportation", content: "Student discounts on public transport. Monthly pass: €15-25." }
            ]
        },
        {
            title: "Visa Process",
            icon: "📋",
            items: [
                { title: "Required Documents", content: "Valid passport, academic transcripts, birth certificate (translated), medical certificate, eligibility certificate, English proficiency certificate (IELTS/TOEFL), financial proof, health insurance." },
                { title: "Processing Time", content: "Typically 15-30 days. Apply at least 2 months before travel." },
                { title: "Visa Fees", content: "Student visa: €80. Residence permit: €340 (paid after arrival)." },
                { title: "Work Permit", content: "Students can work up to 20 hours/week during studies without additional permit." }
            ]
        },
        {
            title: "Student Life",
            icon: "🎓",
            items: [
                { title: "Student Organizations", content: "Over 50 student clubs and organizations including international student associations." },
                { title: "Sports & Recreation", content: "Free access to university sports facilities. Gym membership: €15-30/month." },
                { title: "Cultural Events", content: "Regular cultural festivals, concerts, and international food days." },
                { title: "Language Support", content: "Free Polish language courses for international students." }
            ]
        },
        {
            title: "Practical Information",
            icon: "ℹ️",
            items: [
                { title: "Banking", content: "Student accounts available with no fees. Major banks: PKO, mBank, Santander." },
                { title: "Mobile & Internet", content: "Prepaid SIM cards from €5. Internet packages from €10/month." },
                { title: "Weather", content: "Four seasons. Winter: -5°C to 5°C, Summer: 15°C to 25°C. Pack accordingly!" },
                { title: "Emergency Numbers", content: "General emergency: 112, Police: 997, Medical: 999, Fire: 998" }
            ]
        }
    ];

    return (
        <PublicLayout>
            <Head title="Resources - Life in Poland" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-display font-bold text-dark-900 mb-4">
                            Life in Poland - Resources for International Students
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to know about studying and living in Poland. 
                            From visa applications to daily life tips.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-8 rounded-lg mb-12">
                        <h2 className="text-2xl font-bold mb-6">Quick Links & Downloads</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            <a href="#" className="bg-white/20 backdrop-blur p-4 rounded-lg hover:bg-white/30 transition text-center">
                                <div className="text-3xl mb-2">📄</div>
                                <div className="font-medium">Visa Checklist</div>
                            </a>
                            <a href="#" className="bg-white/20 backdrop-blur p-4 rounded-lg hover:bg-white/30 transition text-center">
                                <div className="text-3xl mb-2">🏥</div>
                                <div className="font-medium">Health Insurance Guide</div>
                            </a>
                            <a href="#" className="bg-white/20 backdrop-blur p-4 rounded-lg hover:bg-white/30 transition text-center">
                                <div className="text-3xl mb-2">🏠</div>
                                <div className="font-medium">Housing Guide</div>
                            </a>
                            <a href="#" className="bg-white/20 backdrop-blur p-4 rounded-lg hover:bg-white/30 transition text-center">
                                <div className="text-3xl mb-2">📚</div>
                                <div className="font-medium">Student Handbook</div>
                            </a>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                                    <div className="flex items-center">
                                        <div className="text-4xl mr-4">{section.icon}</div>
                                        <h3 className="text-2xl font-bold">{section.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {section.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="border-b pb-4 last:border-b-0 last:pb-0">
                                                <h4 className="font-semibold text-dark-900 mb-2">{item.title}</h4>
                                                <p className="text-gray-600">{item.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-12 bg-gray-50 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-dark-900 mb-6 text-center">Frequently Asked Questions</h2>
                        <div className="max-w-3xl mx-auto space-y-4">
                            <details className="bg-white rounded-lg p-6 shadow">
                                <summary className="font-semibold text-dark-900 cursor-pointer">
                                    Do I need to speak the local language to study?
                                </summary>
                                <p className="mt-4 text-gray-600">
                                    No, all international programs at partner universities are conducted entirely in English. However, most universities offer free language courses to help you integrate better into local life.
                                </p>
                            </details>
                            <details className="bg-white rounded-lg p-6 shadow">
                                <summary className="font-semibold text-dark-900 cursor-pointer">
                                    Can I work while studying?
                                </summary>
                                <p className="mt-4 text-gray-600">
                                    Yes! International students can work up to 20 hours per week during the academic year and full-time during holidays without needing an additional work permit.
                                </p>
                            </details>
                            <details className="bg-white rounded-lg p-6 shadow">
                                <summary className="font-semibold text-dark-900 cursor-pointer">
                                    What about post-study opportunities?
                                </summary>
                                <p className="mt-4 text-gray-600">
                                    Poland offers a post-study work visa allowing graduates to stay and search for employment. Many international companies actively recruit graduates from European universities.
                                </p>
                            </details>
                            <details className="bg-white rounded-lg p-6 shadow">
                                <summary className="font-semibold text-dark-900 cursor-pointer">
                                    Is Poland safe for international students?
                                </summary>
                                <p className="mt-4 text-gray-600">
                                    Poland is one of the safest countries in Europe with low crime rates. The university provides 24/7 security on campus and support services for international students.
                                </p>
                            </details>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-12 text-center bg-dark-900 text-white rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
                        <p className="mb-6">Our international student support team is here to help you!</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="mailto:support@nexusstudy.com" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition inline-block">
                                Email Support
                            </a>
                            <a href="#" className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-dark-900 transition inline-block">
                                Schedule a Call
                            </a>
                        </div>
                        <p className="mt-6 text-gray-400">
                            Phone/WhatsApp: +48 794 961 019 | Office Hours: Mon-Fri 9:00-17:00 CET
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
