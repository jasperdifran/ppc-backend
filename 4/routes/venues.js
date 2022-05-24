const venuesRouter = require('express').Router()
const { getUsers, getVenues } = require('../db');

venuesRouter.get("/", async (req, res) => {
    let item = undefined
    let venues = await getVenues();
    if (req.query.id) {
        item = await venues.find(ObjectId(req.query.id)).toArray();
    } else {
        item = await venues.find().toArray();
    }
    console.log(item);
    res.send(item || { "error": "Not found!" })
});

venuesRouter.put("/", async (req, res) => {
    let venues = await getVenues();
    await venues.updateOne({ _id: ObjectId(req.query.id) }, { $set: req.body });
    res.send({ "message": "success!" })
});

venuesRouter.delete("/", async (req, res) => {
    let venues = await getVenues();
    await venues.deleteOne({ _id: ObjectId(req.query.id) });
    res.send({ "message": "success!" })
});

venuesRouter.post("/", async (req, res) => {
    let venues = await getVenues();
    await venues.insertOne(req.body)
    res.send("Success");
});

module.exports.venuesRouter = venuesRouter
