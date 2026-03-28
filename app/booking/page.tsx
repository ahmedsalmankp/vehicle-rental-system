"use client";

import { useState } from "react";

export default function Booking() {

    const [step, setStep] = useState(1);

    return (
        <div className="min-h-screen bg-gray-50 p-10">

            <h1 className="text-3xl font-bold text-center mb-10">
                Vehicle Booking
            </h1>

            {/* STEP 1 - LICENSE */}
            {step === 1 && (
                <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
                    <h2 className="font-semibold mb-4">Upload Driving License</h2>

                    <input type="file" className="mb-4" />

                    <button
                        onClick={() => setStep(2)}
                        className="w-full bg-orange-500 text-white py-2 rounded-md"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* STEP 2 - PAYMENT */}
            {step === 2 && (
                <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
                    <h2 className="font-semibold mb-4">Payment Details</h2>

                    <input placeholder="Card Number" className="border p-2 w-full mb-3" />
                    <input placeholder="Expiry Date" className="border p-2 w-full mb-3" />
                    <input placeholder="CVV" className="border p-2 w-full mb-3" />

                    <button
                        onClick={() => setStep(3)}
                        className="w-full bg-orange-500 text-white py-2 rounded-md"
                    >
                        Pay Now
                    </button>
                </div>
            )}

            {/* STEP 3 - SUCCESS */}
            {step === 3 && (
                <div className="text-center">
                    <h2 className="text-2xl text-green-600 font-bold">
                        Booking Successful 🎉
                    </h2>
                </div>
            )}

        </div>
    );
}