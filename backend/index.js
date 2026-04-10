const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/rental")
    .then(async () => {
        console.log("MongoDB Connected");

        await insertVehicles(); // ✅ ADD THIS LINE
    })
    .catch(err => console.log(err));
// Models
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
const Booking = require("./models/Booking");
// Insert dummy vehicles (run once)
async function insertVehicles() {
    await Vehicle.deleteMany({});

    await Vehicle.insertMany([
        { name: "Honda City", price: 2000, image: "/cars/innova.webp", location: "Hyderabad, Telangana" },
        { name: "Swift", price: 1500, image: "/cars/maruti.avif", location: "Bangalore, Karnataka" },
        { name: "Creta", price: 2500, image: "/cars/brezza.avif", location: "Kochi, Kerala" },
        { name: "BMW", price: 4000, image: "/cars/bmw.webp", location: "Vijayawada, Andhra Pradesh" },
        { name: "Audi A6", price: 3500, image: "/cars/Audi-A6.webp", location: "Vizag, Andhra Pradesh" },
        { name: "Benz", price: 4200, image: "/cars/benz.avif", location: "Mysore, Karnataka" },
        { name: "Lamborghini", price: 8000, image: "/cars/Lamborghini.webp", location: "Trivandrum, Kerala" },
        { name: "Thar", price: 3000, image: "/cars/blackthar.webp", location: "Guntur, Andhra Pradesh" },
        { name: "Rolls Royce", price: 10000, image: "/cars/rollsroyce.avif", location: "Chennai, Tamil Nadu" },
        { name: "Maruti Omni", price: 800, image: "/cars/omni.avif", location: "Pune, Maharashtra" },
        { name: "Red Thar", price: 3200, image: "/cars/redthar.avif", location: "Tirupati, Andhra Pradesh" },
        { name: "Maruti Brezza", price: 2200, image: "/cars/brezza.avif", location: "Delhi" },
        { name: "Audi A6", price: 3500, image: "/cars/Audi-A6.webp", location: "Ongole, Andhra Pradesh" },
        { name: "Benz", price: 4200, image: "/cars/benz.avif", location: "Coorg, Karnataka" },
        { name: "Lamborghini", price: 8000, image: "/cars/Lamborghini.webp", location: "Palakkad, Kerala" },
        { name: "Thar", price: 3000, image: "/cars/blackthar.webp", location: "Rayachoti, Andhra Pradesh" },
        { name: "Rolls Royce", price: 10000, image: "/cars/rollsroyce.avif", location: "Coimbatore, Tamil Nadu" },
        { name: "Maruti Omni", price: 800, image: "/cars/omni.avif", location: "Madanapalli, Andhra Pradesh" },
        { name: "Red Thar", price: 3200, image: "/cars/redthar.avif", location: "Madanapalli, Andhra Pradesh" },
        { name: "Maruti Brezza", price: 2200, image: "/cars/brezza.avif", location: "Delhi" }
    ]);

    console.log("Vehicles inserted ✅");
};

// Fraud logic
function fraudScore(user) {
    let score = 0;
    if (user.bookings > 5) score += 30;
    if (user.failedPayments > 2) score += 50;
    return score;
}

// Register API
app.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            bookings: 0,
            failedPayments: 0
        });

        user.fraudScore = fraudScore(user);
        await user.save();

        res.json({ success: true, message: "Registration successful" });
    } catch (err) {
        res.status(500).json({ error: "Server error during registration" });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.password !== req.body.password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        user.fraudScore = fraudScore(user);
        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// Reset Password API
app.post("/reset-password", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.password = req.body.newPassword;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error during password reset" });
    }
});


// Get vehicles
app.get("/vehicles", async (req, res) => {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
});

// Book vehicle
app.post("/book", async (req, res) => {
    const { userId, vehicleId, carName, date, status } = req.body;

    if (!userId || !vehicleId) {
        return res.status(400).json({ message: "Missing data" });
    }

    const booking = await Booking.create({
        userId,
        vehicleId,
        carName,
        date,
        status: status || "Confirmed"
    });

    res.json(booking);
});

// Get user bookings
app.get("/my-bookings/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).sort({ _id: -1 });
        const formatted = bookings.map(b => ({
            id: b._id,
            carName: b.carName || "Vehicle Booking",
            date: b.date || new Date().toLocaleDateString(),
            status: b.status || "Confirmed"
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));