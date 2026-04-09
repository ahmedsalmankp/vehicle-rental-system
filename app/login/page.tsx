"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "../services/authService";
import InputField from "../components/InputField";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/dashboard";

    const [formData, setFormData] = useState({
        emailOrPhone: "",
        password: "",
        rememberMe: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: formData.emailOrPhone, password: formData.password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to login. Please try again.");
            }

            localStorage.setItem("user", JSON.stringify(data));
            window.dispatchEvent(new Event("authStatusChanged"));
            router.push(redirectUrl);
        } catch (err: any) {
            setError(err.message || "Failed to login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-orange-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        <span className="text-orange-500">Rent</span> & Ride
                    </h1>
                    <p className="text-gray-500 mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Email or Phone Number"
                        name="emailOrPhone"
                        value={formData.emailOrPhone}
                        onChange={handleChange}
                        placeholder="Enter your email or phone"
                        required
                    />

                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="mr-2 rounded text-orange-500 focus:ring-orange-500"
                            />
                            Remember Me
                        </label>
                        <Link href="/forgot-password" className="text-orange-500 hover:text-orange-600 font-semibold transition">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed mt-6 flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Signing in...</span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-8 text-sm">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-orange-500 font-bold hover:text-orange-600 transition">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
