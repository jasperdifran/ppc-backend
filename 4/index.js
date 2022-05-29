const express = require('express')
const { initDb } = require("./db");
const { usersRouter } = require('./routes/users');
const { venuesRouter } = require('./routes/venues')

var app = express();

app.use(express.json())

app.use("/venues", venuesRouter);
app.use("/users", usersRouter)

app.listen(5000, async () => {
    await initDb();
    console.log("Server started");
    console.log("Listening on port 5000");
});
