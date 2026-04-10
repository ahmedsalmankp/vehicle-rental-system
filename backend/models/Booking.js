const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: String,
    vehicleId: String,
    carName: String,
    date: String,
    status: { type: String, default: "Confirmed" }
});

module.exports = mongoose.model("Booking", bookingSchema);