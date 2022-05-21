const express = require('express')
const { MongoClient, ObjectID } = require('mongodb');

var app = express();
var router = express.Router();

const url = 'mongodb+srv://jasperdif:2Rtyz501@cluster0.3jv0w.mongodb.net/?retryWrites=true&w=majority'
let client = new MongoClient(url);

let db = undefined;
let col = undefined;

const dbName = 'venues'

app.use(express.json())

app.use("/", router);

app.get("/venues", async (req, res) => {
    let item = undefined
    if (req.query.id) {
        item = await col.find(ObjectID(req.query.id)).toArray();
    } else {
        item = await col.find().toArray();
    }
    res.send(item || {"error": "Not found!"})
});

app.put("/venues", async (req, res) => {
    await col.updateOne({_id: ObjectID(req.query.id)}, {$set: req.body});
    res.send({"message": "success!"})
});

app.delete("/venues", async (req, res) => {
    await col.deleteOne({_id: ObjectID(req.query.id)});
    res.send({"message": "success!"})
});

app.post("/venues", async (req, res) => {
    await col.insertOne(req.body)
    res.send("Success");
});

app.listen(5000, async () => {
    await client.connect();
    db = client.db('venues');
    col = db.collection('venues');
    console.log("Server started");
    console.log("Listening on port 5000");
});
