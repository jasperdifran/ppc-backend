const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Venue = new Schema({
    name: {
        type: String,
        default: "",
    },
    tags: {
        type: [String],
        default: [],
    },
    address: {
        type: String,
        default: "",
    },
    notes: {
        type: String,
        default: "",
    },
    visits: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model("Venue", Venue)