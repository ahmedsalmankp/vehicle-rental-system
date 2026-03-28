"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Authenticate the user on client-side mount
        const checkUser = () => {
            const user = localStorage.getItem("user");
            setIsLoggedIn(!!user);
        };
        checkUser();

        // Listen for custom login/logout events to update immediately 
        window.addEventListener("authStatusChanged", checkUser);
        return () => window.removeEventListener("authStatusChanged", checkUser);
    }, [pathname]); // Refresh occasionally

    const handleNavigation = (item: string) => {
        if (item === "Home") {
            if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                router.push("/");
            }
        } else if (item === "Vehicles") {
            if (isLoggedIn) {
                router.push("/vehicles");
            } else {
                router.push("/login?redirect=/vehicles");
            }
        } else {
            // "Booking", "Dashboard"
            if (isLoggedIn) {
                router.push(`/${item.toLowerCase()}`);
            } else {
                router.push(`/login?redirect=/${item.toLowerCase()}`);
            }
        }
    };

    return (
        <nav className="fixed top-0 w-full bg-white shadow-md border-b-2 border-orange-500 z-50 flex justify-between items-center px-6 md:px-10 py-4">
            {/* LOGO */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                <img src="/Logo/logo.png" alt="Rent & Ride Logo" className="w-10 h-10 hover:scale-110 transition" />
                <h1 className="text-xl md:text-2xl font-bold">
                    <span className="text-orange-500">Rent</span> <span className="text-gray-800">& Ride</span>
                </h1>
            </div>

            {/* NAV LINKS */}
            <div className="hidden md:flex gap-6 text-gray-600">
                {["Home", "Vehicles", "Booking", "Dashboard"].map((item, i) => {
                    const targetPath = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                    const isActive = pathname === targetPath;
                    return (
                        <p
                            key={i}
                            onClick={() => handleNavigation(item)}
                            className={`cursor-pointer transition ${isActive ? "text-orange-500 font-bold" : "hover:text-orange-500 font-medium"}`}
                        >
                            {item}
                        </p>
                    );
                })}
            </div>

            {/* RIGHT SIDE / PROFILE */}
            <div className="flex gap-3 items-center">
                {!isLoggedIn ? (
                    <>
                        <button
                            onClick={() => router.push("/login")}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100 transition whitespace-nowrap text-sm md:text-base font-medium"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => router.push("/register")}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition whitespace-nowrap text-sm md:text-base font-medium"
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => router.push("/dashboard")} // Or Profile if that page existed, sending to Dashboard as it has Profile settings
                    >
                        <img
                            src="/cars/user.png"
                            alt="User Profile"
                            className="w-10 h-10 rounded-full border-2 border-orange-500 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.8)] transition"
                        />
                        <span className="hidden md:block font-medium group-hover:text-orange-500">Profile</span>
                    </div>
                )}
            </div>
        </nav>
    );
}
