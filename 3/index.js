const express = require('express')
const Venue = require('./models/venue')
const mongoose = require('mongoose')

var app = express();
var router = express.Router();

const url = 'mongodb+srv://jasperdif:2Rtyz501@cluster0.3jv0w.mongodb.net/venueWatcher?retryWrites=true&w=majority'

app.use(express.json())

app.use("/", router);

app.get("/venues", async (req, res) => {
    let item = undefined
    if (req.query.id) {
        item = await Venue.findById(req.query.id)
    } else {
        item = await Venue.find()
    }
    res.send(item || { "error": "Not found!" })
});

app.put("/venues", async (req, res) => {
    await Venue.findByIdAndUpdate(req.query.id, req.body)
    res.send({ "message": "success!" })
});

app.delete("/venues", async (req, res) => {
    await Venue.findByIdAndDelete(req.query.id)
    res.send({ "message": "success!" })
});

app.post("/venues", async (req, res) => {
    let item = new Venue(req.body)
    await item.save();
    res.send({ "message": "success!" })
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
