const express = require('express')

var app = express();
var router = express.Router();

let database = {johnscafe: "rated 10"};

app.use(express.json())

app.use("/", router);

app.get("/venues", (req, res) => {
    res.send(database);
})

app.get("/venues/:name", (req, res) => {
    res.send(database[req.params.name] ||"Hey there!");
});

app.post("/venues", (req, res) => {
    Object.assign(database, req.body);
    res.send("Success");
});

app.listen(9000, () => {
    console.log("Server started");
    console.log("Listening on port 9000"); 
});
