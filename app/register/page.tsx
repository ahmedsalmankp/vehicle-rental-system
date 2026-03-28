"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "../services/authService";
import InputField from "../components/InputField";

export default function Register() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/vehicles";

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        licenseNumber: "",
        licenseExpiry: "",
        addressCity: "",
        addressState: "",
        addressPincode: ""
    });

    const [licenseImage, setLicenseImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        if (type === "file") {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) setLicenseImage(file);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
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

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await authService.register({ ...formData, licenseImage: licenseImage?.name });
            // Mock auto-login
            localStorage.setItem("user", JSON.stringify({ name: formData.fullName, email: formData.email, token: "fake-jwt-123" }));
            window.dispatchEvent(new Event("authStatusChanged"));
            
            router.push(redirectUrl);
        } catch (err: any) {
            setError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-12">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border-t-4 border-orange-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Join <span className="text-orange-500">Rent</span> & Ride
                    </h1>
                    <p className="text-gray-500 mt-2">Create an account to start your journey</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />

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
                            label="Phone Number"
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                            required
                        />

                        {/* Spacer for grid */}
                        <div className="hidden md:block"></div>

                        <InputField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            required
                        />

                        <InputField
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <hr className="border-gray-200" />

                    <h3 className="text-lg font-semibold text-gray-700">Driving License Details</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField
                            label="License Number"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            placeholder="DL-1234567890"
                            required
                        />

                        <InputField
                            label="License Expiry Date"
                            type="date"
                            name="licenseExpiry"
                            value={formData.licenseExpiry}
                            onChange={handleChange}
                            required
                        />

                        <div className="md:col-span-2">
                            <InputField
                                label="Upload License Image"
                                type="file"
                                name="licenseImage"
                                value={""} // File inputs don't use controlled string values
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    <h3 className="text-lg font-semibold text-gray-700">Address Details</h3>

                    <div className="grid md:grid-cols-3 gap-4">
                        <InputField
                            label="City"
                            name="addressCity"
                            value={formData.addressCity}
                            onChange={handleChange}
                            placeholder="E.g., Mumbai"
                            required
                        />

                        <InputField
                            label="State"
                            name="addressState"
                            value={formData.addressState}
                            onChange={handleChange}
                            placeholder="E.g., Maharashtra"
                            required
                        />

                        <InputField
                            label="Pincode"
                            name="addressPincode"
                            value={formData.addressPincode}
                            onChange={handleChange}
                            placeholder="E.g., 400001"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 text-white font-bold py-3 mt-4 rounded-md hover:bg-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Creating Account...</span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-8 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-orange-500 font-bold hover:text-orange-600 transition">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}
