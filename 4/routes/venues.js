const venuesRouter = require('express').Router()
const { getUsers, getVenues } = require('../db');

venuesRouter.get("/", async (req, res) => {
    let item = undefined
    if (req.query.id) {
        item = await Venue.findById(req.query.id)
    } else {
        item = await Venue.find()
    }
    res.send(item || { "message": "Not found!" })
});

venuesRouter.put("/", async (req, res) => {
    await Venue.findByIdAndUpdate(req.query.id, req.body)
    res.send({ "message": "success!" })
});

venuesRouter.delete("/", async (req, res) => {
    await Venue.findByIdAndDelete(req.query.id)
    res.send({ "message": "success!" })
});

venuesRouter.post("/", async (req, res) => {
    let item = new Venue(req.body)
    await item.save();
    res.send({ "message": "success!" })
});

module.exports = venuesRouter
