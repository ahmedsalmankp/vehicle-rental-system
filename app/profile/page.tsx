"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
            router.push("/login?redirect=/profile");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser._id || parsedUser.id;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
                // Fallback to session user if API fails
                setUser(parsedUser);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        window.dispatchEvent(new Event("authStatusChanged"));
        router.push("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pb-16">
                <Navbar />
                <div className="pt-32 text-center text-gray-600">Loading profile...</div>
            </div>
        );
    }

    // Default icon if no avatar provided
    const avatarUrl = user?.profilePicture || "/default-avatar.png";

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Navbar />
            <div className="pt-32 px-6 md:px-10 max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border-t-4 border-orange-500 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="shrink-0 relative">
                                {user?.profilePicture ? (
                                    <img 
                                        src={user.profilePicture} 
                                        alt="Profile" 
                                        className="w-32 h-32 rounded-full object-cover border-4 border-orange-100 shadow-md"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-orange-100 shadow-md bg-orange-50 text-orange-500 flex items-center justify-center">
                                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-3xl font-bold text-gray-800">{user?.fullName || "User Profile"}</h1>
                                <p className="text-gray-500 mt-1">{user?.email}</p>

                                <div className="mt-6 flex flex-wrap gap-4 justify-center sm:justify-start">
                                    <button className="px-6 py-2 bg-orange-50 text-orange-600 font-semibold rounded-md border border-orange-200 hover:bg-orange-100 transition">
                                        Edit Profile
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="px-6 py-2 bg-white text-red-500 font-semibold rounded-md border border-red-200 hover:bg-red-50 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 border-t pt-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Full Name</p>
                                    <p className="text-gray-800 font-semibold">{user?.fullName || "Not provided"}</p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Email Address</p>
                                    <p className="text-gray-800 font-semibold">{user?.email}</p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Phone Number</p>
                                    <p className="text-gray-800 font-semibold">{user?.phoneNumber || "Not provided"}</p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Driving License <span className="font-normal text-xs text-orange-500 ml-1">(Optional)</span></p>
                                    <p className="text-gray-800 font-semibold">{user?.licenseNumber || "Not provided"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-orange-50 p-6 rounded-xl flex items-center justify-between border border-orange-100">
                                <div>
                                    <p className="text-sm text-orange-600 font-bold uppercase tracking-wider mb-1">Total Bookings</p>
                                    <p className="text-3xl font-black text-gray-800">{user?.bookings || 0}</p>
                                </div>
                                <div className="p-3 bg-white rounded-full text-orange-500 shadow-sm">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
