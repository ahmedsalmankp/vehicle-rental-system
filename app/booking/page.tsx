"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import { useSearchParams, useRouter } from "next/navigation";

interface PastBooking {
    id: string;
    carName: string;
    date: string;
    status: string;
}

function BookingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const vehicleId = searchParams.get("vehicleId") || "unspecified";
    const carName = searchParams.get("carName") || "Selected Vehicle";

    const initialStep = searchParams.get("step") === "success" ? 2 : 1;

    const [step, setStep] = useState(initialStep);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failure">("idle");
    const [pastBookings, setPastBookings] = useState<PastBooking[]>([]);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
            window.location.href = `/login?redirect=/booking?vehicleId=${vehicleId}&carName=${encodeURIComponent(carName)}`;
            return;
        }

        const user = JSON.parse(storedUser);
        const userId = user._id || user.id;

        const API_URL = "http://localhost:5000";
        fetch(`${API_URL}/my-bookings/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch history");
                return res.json();
            })
            .then(data => setPastBookings(data))
            .catch(err => console.error("Error fetching history:", err));
    }, [vehicleId, carName]);

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [form, setForm] = useState({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        upiId: "",
        licenseId: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = async () => {
        if (step === 1) {
            setIsLoading(true);
            const user = JSON.parse(sessionStorage.getItem("user") || "{}");
            const userId = user._id || user.id;

            // Route to simulated payment page
            router.push(`/payment?userId=${userId}&vehicleId=${vehicleId}&carName=${encodeURIComponent(carName)}&method=${paymentMethod}`);
        }
    };

    return (
        <div className="pt-32 px-6 md:px-10 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800">
                    Secure Checkout
                </h1>
                <p className="text-gray-500 mt-2">Booking: <span className="font-semibold text-orange-500">{carName}</span></p>
            </div>

            {/* STEP 1 - PAYMENT */}
            {step === 1 && (
                <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Step 1: Payment Details</h2>

                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setPaymentMethod("card")}
                            className={`flex-1 py-2 text-center rounded-md border-2 font-semibold transition ${paymentMethod === "card" ? "border-orange-500 text-orange-600 bg-orange-50" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                        >
                            💳 Credit/Debit Card
                        </button>
                        <button
                            onClick={() => setPaymentMethod("upi")}
                            className={`flex-1 py-2 text-center rounded-md border-2 font-semibold transition ${paymentMethod === "upi" ? "border-orange-500 text-orange-600 bg-orange-50" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                        >
                            📱 UPI (PhonePe/GPay)
                        </button>
                    </div>

                    {paymentMethod === "card" ? (
                        <div className="space-y-4">
                            <InputField
                                label="Cardholder Name"
                                name="cardName"
                                value={form.cardName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />

                            <InputField
                                label="Card Number"
                                name="cardNumber"
                                value={form.cardNumber}
                                onChange={handleChange}
                                placeholder="XXXX XXXX XXXX XXXX"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Expiry Date"
                                    name="expiry"
                                    value={form.expiry}
                                    onChange={handleChange}
                                    placeholder="MM/YY"
                                    required
                                />
                                <InputField
                                    label="CVV"
                                    type="password"
                                    name="cvv"
                                    value={form.cvv}
                                    onChange={handleChange}
                                    placeholder="123"
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <InputField
                                label="UPI ID"
                                name="upiId"
                                value={form.upiId}
                                onChange={handleChange}
                                placeholder="example@ybl / username@okaxis"
                                required
                            />
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm">
                                Open your UPI App (PhonePe, Google Pay, Paytm) to approve the payment request after you click Pay.
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md mt-6 transition disabled:opacity-75 flex justify-center items-center"
                    >
                        {isLoading ? "Redirecting to Gateway..." : "Pay Securely Now"}
                    </button>
                </div>
            )}

            {/* STEP 2 - SUCCESS */}
            {step === 2 && (
                <div className="bg-white p-10 rounded-xl shadow-lg border-t-4 border-green-500 text-center animate-in zoom-in duration-500">
                    <div className="text-green-500 text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Booking Confirmed!
                    </h2>
                    <p className="text-gray-600">
                        Your vehicle is ready. Check your email for further details.
                    </p>
                    <button
                        onClick={() => window.location.href = "/dashboard"}
                        className="mt-8 px-6 py-2 border border-green-500 text-green-600 font-bold rounded-md hover:bg-green-50 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}

            {/* PAST HISTORY SECTION */}
            <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Past Rental History</h3>

                {pastBookings.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
                        <p className="text-gray-500 italic">No history available.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pastBookings.map((bkg) => (
                            <div key={bkg.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-orange-500">
                                <div>
                                    <h4 className="font-bold text-gray-800">{bkg.carName}</h4>
                                    <p className="text-sm text-gray-500">Booking ID: {bkg.id} • {bkg.date}</p>
                                </div>
                                <span className="mt-2 md:mt-0 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                    {bkg.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Booking() {
    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Navbar />
            <Suspense fallback={<div className="pt-32 text-center">Loading booking details...</div>}>
                <BookingContent />
            </Suspense>
        </div>
    );
}
