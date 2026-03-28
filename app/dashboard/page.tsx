"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        // Authenticate the user on client-side mount
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />
            <div className="pt-28 max-w-4xl mx-auto px-6">
                <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Welcome to Vehicle Rental Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Hello, <span className="font-semibold text-orange-500">{user.name}</span>! You're logged in as {user.email}.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 font-bold px-6 py-2 rounded-md hover:bg-red-100 transition border border-red-200"
                    >
                        Logout
                    </button>
                </header>

                {/* STATS OVERVIEW */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-orange-500">12</span>
                        <h3 className="font-semibold text-gray-800 mt-2">Total Bookings</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-orange-500">4,350</span>
                        <h3 className="font-semibold text-gray-800 mt-2">KMs Travelled</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-orange-500">₹45,200</span>
                        <h3 className="font-semibold text-gray-800 mt-2">Amount Paid</h3>
                    </div>
                </div>

                {/* GRAPH SECTION */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-8">
                    <h3 className="font-bold text-gray-800 mb-6 border-b pb-2">Rental Activity Overview (Amount Paid)</h3>
                    
                    <div className="h-64 flex items-end justify-between gap-2 pt-4 px-2">
                        {/* CSS MOCK CHART */}
                        {[
                            { month: "Jan", height: "h-24", value: "₹4K" },
                            { month: "Feb", height: "h-32", value: "₹6K" },
                            { month: "Mar", height: "h-48", value: "₹9K" },
                            { month: "Apr", height: "h-16", value: "₹3K" },
                            { month: "May", height: "h-40", value: "₹7K" },
                            { month: "Jun", height: "h-56", value: "₹11k" },
                            { month: "Jul", height: "h-20", value: "₹5K" },
                        ].map((bar, i) => (
                            <div key={i} className="flex flex-col items-center w-full group cursor-pointer">
                                <span className="opacity-0 group-hover:opacity-100 text-xs font-bold text-gray-700 mb-2 transition-opacity">
                                    {bar.value}
                                </span>
                                <div className={`w-full max-w-[40px] bg-orange-200 group-hover:bg-orange-500 transition-colors rounded-t-md ${bar.height}`}></div>
                                <span className="text-xs text-gray-500 mt-3 font-medium">{bar.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
