"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "../components/InputField";

function ForgotPasswordForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:5000/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: formData.email, newPassword: formData.newPassword })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password. Please try again.");
            }

            setSuccess("Password reset successfully! Redirecting to login...");
            
            setTimeout(() => {
                router.push("/login");
            }, 2000);
            
        } catch (err: any) {
            setError(err.message || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-12">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-orange-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Reset <span className="text-orange-500">Password</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Enter your email and new password to reset</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md mb-6 text-sm text-center font-medium">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                    />

                    <InputField
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        required
                    />

                    <InputField
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !!success}
                        className="w-full bg-orange-500 text-white font-bold py-3 mt-4 rounded-md hover:bg-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Resetting...</span>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-8 text-sm">
                    Remember your password?{" "}
                    <Link href="/login" className="text-orange-500 font-bold hover:text-orange-600 transition">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function ForgotPassword() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ForgotPasswordForm />
        </Suspense>
    );
}
