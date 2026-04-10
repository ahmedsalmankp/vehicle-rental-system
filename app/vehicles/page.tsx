"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

interface Vehicle {
    _id: string;
    name: string;
    price: string | number;
    img: string;
    location: string;
    mileage: string;
    specs: string;
    rating: string;
    fraudScore: number;
}

export default function Vehicles() {
    const router = useRouter();

    const [searchLocation, setSearchLocation] = useState("");
    const [searchCar, setSearchCar] = useState("");
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setIsLoggedIn(true);
        } else {
            router.replace("/login?redirect=/vehicles");
        }

        // Fetch vehicles from API
        fetch("http://localhost:5000/vehicles")
            .then(res => res.json())
            .then(data => {
                // Map the data to include default images and properties if they are missing
                const formattedVehicles = data.map((v: any) => ({
                    ...v,
                    img: v.image || "/cars/Audi-A6.webp", // Default image
                    location: v.location || "Hyderabad, Telangana",
                    mileage: v.mileage || "12 km/l",
                    specs: v.specs || "Auto, Petrol",
                    rating: v.rating || "4.8",
                    fraudScore: v.fraudScore || 95,
                    price: `₹${v.price}/day`
                }));
                setVehicles(formattedVehicles);
            })
            .catch(err => console.error("Error fetching vehicles:", err));

    }, [router]);

    const filteredVehicles = vehicles.filter((car) => {
        const locMatch = (car.location || "").toLowerCase().includes(searchLocation.toLowerCase());
        const nameMatch = (car.name || "").toLowerCase().includes(searchCar.toLowerCase());
        return locMatch && nameMatch;
    });

    if (isLoggedIn === null) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            {/* 🔥 PAGE CONTENT */}
            <div className="pt-28 px-6 md:px-10 pb-16">

                {/* SEARCH */}
                <div className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row gap-4 mb-10">
                    <input
                        placeholder="Enter Location (e.g., Hyderabad)"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="border p-3 rounded-md w-full"
                    />

                    <input
                        placeholder="Car Name (optional)"
                        value={searchCar}
                        onChange={(e) => setSearchCar(e.target.value)}
                        className="border p-3 rounded-md w-full"
                    />
                </div>

                {/* GRID */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {/* VEHICLES */}
                    <>
                        {filteredVehicles.length === 0 && (
                            <p className="col-span-full text-center text-gray-500 mt-10">
                                No vehicles found 🚫
                            </p>
                        )}

                        {filteredVehicles.map((car, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <Image
                                    src={car.img}
                                    alt={car.name}
                                    width={400}
                                    height={200}
                                    className="w-full h-40 object-cover"
                                />

                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">{car.name}</h3>

                                    <p className="text-sm text-gray-500 mt-1 truncate">
                                        📍 {car.location}
                                    </p>

                                    {/* DETAILS: Mileage & Specs */}
                                    <div className="flex gap-4 mt-2 text-xs font-medium text-gray-600">
                                        <span className="bg-gray-100 px-2 py-1 rounded">⛽ {car.mileage}</span>
                                        <span className="bg-gray-100 px-2 py-1 rounded">⚙️ {car.specs}</span>
                                    </div>

                                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                        <div className="flex flex-col">
                                            <span className="text-sm">⭐ {car.rating}</span>
                                            <span className="text-orange-500 font-bold text-lg leading-tight mt-1">
                                                {car.price}
                                            </span>
                                        </div>

                                        {/* FRAUD SCORE PIE CHART */}
                                        <div className="flex flex-col items-center justify-center relative w-12 h-12 mb-3">
                                            <svg className="w-12 h-12 transform -rotate-90">
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" />
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                                    strokeDasharray="125.6"
                                                    strokeDashoffset={125.6 - (125.6 * car.fraudScore) / 100}
                                                    className={car.fraudScore >= 90 ? "text-green-500" : "text-orange-400"}
                                                    strokeLinecap="round" />
                                            </svg>
                                            <span className="absolute text-[10px] font-bold text-gray-800">{car.fraudScore}%</span>
                                            <span className="text-[9px] font-semibold text-gray-500 absolute -bottom-3">Trust</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/booking?vehicleId=${car._id}&carName=${encodeURIComponent(car.name)}`)}
                                        className="mt-4 w-full bg-orange-500 text-white font-bold py-2 rounded-md hover:bg-orange-600 transition"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}

                    </>
                </div>

            </div>

        </div>
    );
}