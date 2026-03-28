"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Vehicles() {

    const router = useRouter();

    const [searchLocation, setSearchLocation] = useState("");
    const [searchCar, setSearchCar] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) setIsLoggedIn(true);
    }, []);

    const vehicles = [
        {
            name: "Audi A6",
            img: "/cars/Audi-A6.webp",
            price: "₹1800/day",
            rating: "4.8",
            location: "Hyderabad, Telangana"
        },
        {
            name: "BMW",
            img: "/cars/bmw.webp",
            price: "₹2000/day",
            rating: "4.9",
            location: "Chennai, Tamil Nadu"
        },
        {
            name: "Lamborghini",
            img: "/cars/Lamborghini.webp",
            price: "₹5000/day",
            rating: "5.0",
            location: "Kochi, Kerala"
        },
        {
            name: "Maruti Brezza",
            img: "/cars/brezza.avif",
            price: "₹900/day",
            rating: "4.5",
            location: "Vijayawada, Andhra Pradesh"
        },
        {
            name: "Rolls Royce",
            img: "/cars/rollsroyce.avif",
            price: "₹7000/day",
            rating: "5.0",
            location: "Hyderabad, Telangana"
        },
        {
            name: "Innova",
            img: "/cars/innova.webp",
            price: "₹1500/day",
            rating: "4.6",
            location: "Coimbatore, Tamil Nadu"
        }
    ];

    const filteredVehicles = vehicles.filter((car) => {
        return (
            car.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
            car.name.toLowerCase().includes(searchCar.toLowerCase())
        );
    });

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* 🔥 NAVBAR */}
            <nav className="fixed top-0 w-full bg-white shadow-md border-b-2 border-orange-500 z-50 flex justify-between items-center px-6 md:px-10 py-4">

                {/* LOGO */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                    <img src="/Logo/logo.png" className="w-10 h-10" />
                    <h1 className="text-xl md:text-2xl font-bold">
                        <span className="text-orange-500">Rent</span> & Ride
                    </h1>
                </div>

                {/* NAV LINKS */}
                <div className="hidden md:flex gap-6 text-gray-600">
                    {["Home", "Vehicles", "Booking", "Dashboard"].map((item, i) => (
                        <p
                            key={i}
                            onClick={() => {
                                if (item === "Home") router.push("/");
                                else if (item === "Vehicles") router.push("/vehicles");
                                else isLoggedIn
                                    ? router.push(`/${item.toLowerCase()}`)
                                    : router.push("/login");
                            }}
                            className="cursor-pointer hover:text-orange-500 transition"
                        >
                            {item}
                        </p>
                    ))}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex gap-3 items-center">

                    {!isLoggedIn ? (
                        <>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-4 py-2 border rounded-md"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => router.push("/register")}
                                className="px-4 py-2 bg-orange-500 text-white rounded-md"
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 cursor-pointer">
                            <img
                                src="/cars/user.png"
                                className="w-10 h-10 rounded-full border-2 border-orange-500"
                            />
                            <span className="hidden md:block font-medium">Profile</span>
                        </div>
                    )}

                </div>
            </nav>

            {/* 🔥 PAGE CONTENT */}
            <div className="pt-28 px-6 md:px-10">

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
                <div className="grid md:grid-cols-4 gap-6">

                    {/* VEHICLES */}
                    <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

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

                                    <p className="text-sm text-gray-500 mt-1">
                                        📍 {car.location}
                                    </p>

                                    <div className="flex justify-between mt-2 text-sm">
                                        <span>⭐ {car.rating}</span>
                                        <span className="text-orange-500 font-semibold">
                                            {car.price}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => router.push("/booking")}
                                        className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* FRAUD SCORE */}
                    <div className="bg-white rounded-xl shadow-md p-6 text-center h-fit">
                        <h3 className="font-bold mb-4">AI Fraud Score</h3>

                        <div className="w-32 h-32 mx-auto rounded-full border-[10px] border-orange-500 flex items-center justify-center text-2xl font-bold text-orange-500">
                            92%
                        </div>

                        <p className="mt-4 text-gray-600">Trust Score</p>

                        <div className="mt-6 text-sm text-gray-600 space-y-2">
                            <p>✔ Identity Verified</p>
                            <p>✔ Fraud Risk: Low</p>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}