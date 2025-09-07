import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function EditApplication({ auth, application, programs }) {
    const { data, setData, put, processing, errors } = useForm({
        program_id: application.program_id || '',
        first_name: application.first_name || '',
        last_name: application.last_name || '',
        date_of_birth: application.date_of_birth || '',
        nationality: application.nationality || '',
        passport_number: application.passport_number || '',
        email: application.email || '',
        phone: application.phone || '',
        address: application.address || '',
        city: application.city || '',
        country: application.country || '',
        postal_code: application.postal_code || '',
        education_level: application.education_level || '',
        institution_name: application.institution_name || '',
        graduation_year: application.graduation_year || new Date().getFullYear(),
        gpa: application.gpa || '',
        english_proficiency: application.english_proficiency || '',
        english_test_score: application.english_test_score || '',
        motivation_letter: application.motivation_letter || '',
        emergency_contact_name: application.emergency_contact_name || '',
        emergency_contact_phone: application.emergency_contact_phone || '',
        emergency_contact_relationship: application.emergency_contact_relationship || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('student.applications.update', application.id));
    };

    const educationLevels = [
        'High School',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'Doctoral Degree',
        'Other'
    ];

    const englishProficiencyOptions = [
        'Native Speaker',
        'IELTS',
        'TOEFL',
        'Cambridge English',
        'Other'
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Application</h2>}
        >
            <Head title="Edit Application" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {application.status !== 'draft' && (
                        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                            This application has been submitted and cannot be edited.
                        </div>
                    )}
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit} className="space-y-8">
                                {/* Program Selection */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Program Selection</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <InputLabel htmlFor="program_id" value="Select Program" />
                                            <select
                                                id="program_id"
                                                className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                                                value={data.program_id}
                                                onChange={e => setData('program_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Select a program</option>
                                                {programs.map(program => (
                                                    <option key={program.id} value={program.id}>
                                                        {program.name} - {program.degree_type} ({program.duration_years} years)
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.program_id} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="first_name" value="First Name" />
                                            <TextInput
                                                id="first_name"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.first_name}
                                                onChange={e => setData('first_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.first_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="last_name" value="Last Name" />
                                            <TextInput
                                                id="last_name"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.last_name}
                                                onChange={e => setData('last_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.last_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="date_of_birth" value="Date of Birth" />
                                            <TextInput
                                                id="date_of_birth"
                                                type="date"
                                                className="mt-1 block w-full"
                                                value={data.date_of_birth}
                                                onChange={e => setData('date_of_birth', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.date_of_birth} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="nationality" value="Nationality" />
                                            <TextInput
                                                id="nationality"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.nationality}
                                                onChange={e => setData('nationality', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.nationality} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="passport_number" value="Passport Number" />
                                            <TextInput
                                                id="passport_number"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.passport_number}
                                                onChange={e => setData('passport_number', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.passport_number} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="phone" value="Phone Number" />
                                            <TextInput
                                                id="phone"
                                                type="tel"
                                                className="mt-1 block w-full"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.phone} className="mt-2" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="address" value="Address" />
                                            <TextInput
                                                id="address"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.address} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="city" value="City" />
                                            <TextInput
                                                id="city"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.city}
                                                onChange={e => setData('city', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.city} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="country" value="Country" />
                                            <TextInput
                                                id="country"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.country}
                                                onChange={e => setData('country', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.country} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="postal_code" value="Postal Code" />
                                            <TextInput
                                                id="postal_code"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.postal_code}
                                                onChange={e => setData('postal_code', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.postal_code} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Educational Background */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Educational Background</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="education_level" value="Education Level" />
                                            <select
                                                id="education_level"
                                                className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                                                value={data.education_level}
                                                onChange={e => setData('education_level', e.target.value)}
                                                required
                                            >
                                                <option value="">Select education level</option>
                                                {educationLevels.map(level => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.education_level} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="institution_name" value="Institution Name" />
                                            <TextInput
                                                id="institution_name"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.institution_name}
                                                onChange={e => setData('institution_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.institution_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="graduation_year" value="Graduation Year" />
                                            <TextInput
                                                id="graduation_year"
                                                type="number"
                                                min="1950"
                                                max={new Date().getFullYear() + 5}
                                                className="mt-1 block w-full"
                                                value={data.graduation_year}
                                                onChange={e => setData('graduation_year', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.graduation_year} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="gpa" value="GPA (optional)" />
                                            <TextInput
                                                id="gpa"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="5"
                                                className="mt-1 block w-full"
                                                value={data.gpa}
                                                onChange={e => setData('gpa', e.target.value)}
                                            />
                                            <InputError message={errors.gpa} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Language Proficiency */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">English Language Proficiency</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="english_proficiency" value="English Proficiency" />
                                            <select
                                                id="english_proficiency"
                                                className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                                                value={data.english_proficiency}
                                                onChange={e => setData('english_proficiency', e.target.value)}
                                                required
                                            >
                                                <option value="">Select proficiency type</option>
                                                {englishProficiencyOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.english_proficiency} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="english_test_score" value="Test Score (if applicable)" />
                                            <TextInput
                                                id="english_test_score"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.english_test_score}
                                                onChange={e => setData('english_test_score', e.target.value)}
                                                placeholder="e.g., IELTS 7.5"
                                            />
                                            <InputError message={errors.english_test_score} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Motivation Letter */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Motivation Letter</h3>
                                    <div>
                                        <InputLabel htmlFor="motivation_letter" value="Why do you want to study at UITM Poland?" />
                                        <textarea
                                            id="motivation_letter"
                                            className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                                            rows="6"
                                            value={data.motivation_letter}
                                            onChange={e => setData('motivation_letter', e.target.value)}
                                            required
                                            minLength="200"
                                        />
                                        <p className="mt-1 text-sm text-gray-600">Minimum 200 characters</p>
                                        <InputError message={errors.motivation_letter} className="mt-2" />
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <InputLabel htmlFor="emergency_contact_name" value="Contact Name" />
                                            <TextInput
                                                id="emergency_contact_name"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.emergency_contact_name}
                                                onChange={e => setData('emergency_contact_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.emergency_contact_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="emergency_contact_phone" value="Contact Phone" />
                                            <TextInput
                                                id="emergency_contact_phone"
                                                type="tel"
                                                className="mt-1 block w-full"
                                                value={data.emergency_contact_phone}
                                                onChange={e => setData('emergency_contact_phone', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.emergency_contact_phone} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="emergency_contact_relationship" value="Relationship" />
                                            <TextInput
                                                id="emergency_contact_relationship"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.emergency_contact_relationship}
                                                onChange={e => setData('emergency_contact_relationship', e.target.value)}
                                                required
                                                placeholder="e.g., Parent, Spouse"
                                            />
                                            <InputError message={errors.emergency_contact_relationship} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                {application.status === 'draft' && (
                                    <div className="flex items-center justify-between pt-4">
                                        <Link
                                            href={route('student.applications.index')}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            Cancel
                                        </Link>
                                        <PrimaryButton disabled={processing}>
                                            Update Application
                                        </PrimaryButton>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
