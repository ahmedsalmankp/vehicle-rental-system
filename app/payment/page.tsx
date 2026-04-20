"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const userId = searchParams.get("userId");
    const vehicleId = searchParams.get("vehicleId");
    const carName = searchParams.get("carName");
    const method = searchParams.get("method") || "card";

    const [status, setStatus] = useState<"processing" | "success" | "failure">("processing");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!userId || !vehicleId) {
            router.push("/");
            return;
        }

        // Simulate a payment gateway sequence
        const timer1 = setTimeout(() => setProgress(30), 1000);
        const timer2 = setTimeout(() => setProgress(70), 2000);
        
        const finalTimer = setTimeout(async () => {
            setProgress(100);

            // Give a 95% chance of success
            const isSuccess = Math.random() > 0.05;

            if (isSuccess) {
                setStatus("success");
                
                try {
                    // Create booking!
                    const bookingDate = new Date().toLocaleDateString();
                    const API_URL = "http://localhost:5000";
                    const res = await fetch(`${API_URL}/book`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            userId, 
                            vehicleId,
                            carName,
                            date: bookingDate,
                            status: "Confirmed",
                            paymentMethod: method
                        })
                    });

                    if (!res.ok) throw new Error("Booking failed");
                    
                    // Redirect to booking page with success step
                    setTimeout(() => {
                        router.push(`/booking?step=success&carName=${encodeURIComponent(carName || "")}`);
                    }, 1500);

                } catch (err) {
                    console.error(err);
                    setStatus("failure");
                }
            } else {
                setStatus("failure");
            }
        }, 3500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(finalTimer);
        };
    }, [userId, vehicleId, carName, method, router]);

    return (
        <div className="pt-32 px-6 md:px-10 max-w-lg mx-auto text-center">
            <div className="bg-white p-10 rounded-xl shadow-2xl border-t-4 border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 w-full left-0 bg-gray-100 h-1">
                    <div 
                        className="bg-green-500 h-1 transition-all duration-700" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                        {status === "processing" && (
                            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {status === "success" && (
                            <svg className="h-10 w-10 text-green-500 animate-in zoom-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        )}
                        {status === "failure" && (
                            <svg className="h-10 w-10 text-red-500 animate-in zoom-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        )}
                    </div>
                </div>

                {status === "processing" && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment...</h2>
                        <p className="text-gray-500 text-sm">Please do not refresh or close this window.</p>
                        
                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
                            <span className="text-gray-400 font-medium tracking-widest uppercase">Secured by</span>
                            <div className="font-bold text-indigo-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.996 0a12 12 0 00-12 12A12.015 12.015 0 000 12v3h12V3h6v4h-6v8h6v-3h6V12a12 12 0 00-12-12z"/></svg>
                                Stripe / Razorpay (Simulated)
                            </div>
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                        <p className="text-gray-700 font-medium">Your vehicle has been booked.</p>
                        <p className="text-gray-400 text-sm mt-3 animate-pulse">Redirecting to confirmation...</p>
                    </>
                )}

                {status === "failure" && (
                    <>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                        <p className="text-gray-700">The transaction was declined by your bank.</p>
                        <button 
                            onClick={() => router.back()}
                            className="mt-6 w-full text-center px-4 py-3 bg-red-50 text-red-600 font-bold rounded-lg border border-red-200 hover:bg-red-100 transition"
                        >
                            Review & Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Navbar />
            <Suspense fallback={<div className="pt-32 text-center">Loading gateway...</div>}>
                <PaymentContent />
            </Suspense>
        </div>
    );
}
