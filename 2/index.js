const express = require('express')
const { MongoClient } = require('mongodb');

var app = express();
var router = express.Router();

const url = 'mongodb+srv://jasperdif:2Rtyz501@cluster0.3jv0w.mongodb.net/?retryWrites=true&w=majority'
let client = new MongoClient(url);

let db = undefined;
let col = undefined;

const dbName = 'venues'

app.use(express.json())

app.use("/", router);

app.get("/venues", (req, res) => {
    res.send(database);
})

app.get("/venues", async (req, res) => {
    let query = { name: req.query.name };
    let item = await col.findOne(query);
    if (item) {
        res.status(200).send(item)
    } else {
        res.status(404).send({ "error": "Not found!" })
    }
});

app.post("/venues", async (req, res) => {
    await col.insertOne(req.body)
    res.status(200).send("Success");
});

app.listen(5000, async () => {
    await client.connect();
    db = client.db('venues');
    col = db.collection('venues');
    console.log("Server started");
    console.log("Listening on port 5000");
});
