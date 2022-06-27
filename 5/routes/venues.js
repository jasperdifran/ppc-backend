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

    if (item) {
        res.status(200).send(item)
    } else {
        res.status(404).send({ error: "None found" })
    }
});

venuesRouter.put("/", async (req, res) => {
    let venues = await getVenues();
    let up = await venues.updateOne({ _id: ObjectId(req.query.id) }, { $set: req.body });
    if (up.modifiedCount > 0) {
        res.status(200).send({ message: "Success!" })
    } else {
        res.status(404).send({ error: "Not found!" })
    }
});

venuesRouter.delete("/", async (req, res) => {
    let venues = await getVenues();
    await venues.deleteOne({ _id: ObjectId(req.query.id) });
    res.status(200).send({ message: "Success!" })
});

venuesRouter.post("/", async (req, res) => {
    let venues = await getVenues();
    await venues.insertOne(req.body)
    res.status(200).send({ message: "Success!" });
});

module.exports.venuesRouter = venuesRouter
