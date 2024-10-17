"use client"

import Image from 'next/image';
import { useState } from 'react';

const Register = () => {
    const [activeTab, setActiveTab] = useState<'individual' | 'charity'>('individual');

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/auth/hero.jpg')" }}>
                <div className="flex items-center justify-center h-full">
                    <Image src='/images/auth/logo.svg' alt='Logo' width={367} height={100} />
                </div>
            </div>
            <div className="w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-6">Register</h2>
                    <div className="flex space-x-2 mb-4">
                        <button
                            className={`px-4 py-2 rounded-full ${activeTab === 'individual' ? 'bg-purple-100 text-purple-700' : 'bg-transparent text-gray-500'}`}
                            onClick={() => setActiveTab('individual')}
                        >
                            Individual
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full ${activeTab === 'charity' ? 'bg-purple-100 text-purple-700' : 'bg-transparent text-gray-500'}`}
                            onClick={() => setActiveTab('charity')}
                        >
                            Charity/Brand
                        </button>
                    </div>

                    {activeTab === 'individual' && (
                        <form className="space-y-4">
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    className="w-1/2 p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    className="w-1/2 p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <button type="submit" className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800">
                                Register
                            </button>
                            <p className="text-center text-sm">
                                Already have an account? <a href="/auth/login" className="text-purple-700">Login</a>
                            </p>
                        </form>
                    )}

                    {activeTab === 'charity' && (
                        <form className="space-y-4">
                            {[1, 2, 3].map((_, index) => (
                                <div key={index} className="flex space-x-4">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="w-1/2 p-2 border border-gray-300 rounded"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-1/2 p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            ))}
                            <button type="submit" className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800">
                                Register
                            </button>
                            <p className="text-center text-sm">
                                Already have an account? <a href="/auth/login" className="text-purple-700">Login</a>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
