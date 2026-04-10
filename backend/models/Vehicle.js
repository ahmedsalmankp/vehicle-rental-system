const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    location: String
});

module.exports = mongoose.model("Vehicle", vehicleSchema);