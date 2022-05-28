const express = require('express')
const mongoose = require('mongoose');
const Venue = require('./models/venue');

var app = express();
var router = express.Router();

const url = 'mongodb+srv://jasperdif:2Rtyz501@cluster0.3jv0w.mongodb.net/venueWatcher?retryWrites=true&w=majority'

app.use(express.json())

app.use("/", router);

app.get("/venues", async (req, res) => {
    let query = { name: req.query.name };
    let v = await Venue.find(query).exec();
    res.send(v)
});

app.post("/venues", async (req, res) => {
    let item = new Venue(req.body)
    await item.save();
    res.send({ message: "Venue inserted" });
});

app.listen(5000, async () => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Server started");
        console.log("Listening on port 5000");
    })
});
