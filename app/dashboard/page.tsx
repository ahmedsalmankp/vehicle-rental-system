"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import Navbar from "../components/Navbar";

const getFraudDetails = (score: number) => {
    if (score <= 30) return { label: "Low Risk", badge: "Safe", color: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-500", msg: "Safe User – Excellent rental standing." };
    if (score <= 70) return { label: "Medium Risk", badge: "Warning", color: "bg-yellow-50 border-yellow-200 text-yellow-700", dot: "bg-yellow-500", msg: "Medium Risk – Monitor recent activities." };
    return { label: "High Risk", badge: "Dangerous", color: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500", msg: "High Risk User – Additional verification required." };
};

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    const [pastBookings, setPastBookings] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("user");

        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            window.location.href = "/login";
        }

        const history = localStorage.getItem("pastBookings");
        if (history) {
            setPastBookings(JSON.parse(history));
        }
    }, []);

    useEffect(() => {
        const updateUser = () => {
            const stored = localStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        };

        window.addEventListener("authStatusChanged", updateUser);

        return () => {
            window.removeEventListener("authStatusChanged", updateUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 font-semibold">Please log in to view the dashboard.</p>
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
                            Hello, <span className="font-semibold text-orange-500">{user.email.split("@")[0]}</span>! You're logged in as <span className="font-semibold">{user.email}</span>.
                        </p>
                        {/* AI Trust Score Block */}
                        <div className={`mt-4 p-4 rounded-xl border ${getFraudDetails(user.fraudScore || 0).color} flex items-start gap-3 w-full md:w-96 shadow-sm`}>
                            <div className={`mt-0.5 w-3 h-3 rounded-full ${getFraudDetails(user.fraudScore || 0).dot} animate-pulse flex-shrink-0`}></div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold uppercase tracking-wide opacity-80">Fraud Score: {user.fraudScore || 0}</span>
                                    <span className="px-2 py-0.5 rounded bg-white text-xs font-bold border border-current opacity-90 shadow-sm">
                                        {getFraudDetails(user.fraudScore || 0).badge}
                                    </span>
                                </div>
                                <p className="text-xs font-medium mt-1.5 opacity-90 leading-tight">
                                    {getFraudDetails(user.fraudScore || 0).msg}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 font-bold px-6 py-2 rounded-md hover:bg-red-100 transition border border-red-200"
                    >
                        Logout
                    </button>
                </header>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-orange-500">{pastBookings.length}</span>
                        <h3 className="font-semibold text-gray-800 mt-2">Total Bookings</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-orange-500">Active</span>
                        <h3 className="font-semibold text-gray-800 mt-2">Account Status</h3>
                    </div>
                </div>

                <div className="mt-10">
                    <h3 className="font-bold text-gray-800 mb-6 border-b pb-2 text-xl">Your Rental History</h3>

                    {pastBookings.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
                            <p className="text-gray-500 italic mb-4">You have no active vehicle bookings.</p>
                            <button onClick={() => router.push("/vehicles")} className="px-6 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition">
                                Browse Vehicles
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pastBookings.map((bkg: any) => (
                                <div key={bkg.id} className="bg-white p-5 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-orange-500 hover:shadow-lg transition">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">{bkg.carName}</h4>
                                        <p className="text-sm text-gray-500 mt-1">Booking ID: {bkg.id} • Date: {bkg.date}</p>
                                    </div>
                                    <span className="mt-3 md:mt-0 px-4 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200 shadow-sm">
                                        {bkg.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
