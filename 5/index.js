const express = require('express')
const { initDb } = require("./db");
const { usersRouter } = require('./routes/users');
const { venuesRouter } = require('./routes/venues')

var app = express();

app.use(express.json())

let logger = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    let log = `[${formatted_date}] ${method}:${url} ${status}`;
    console.log(log);
    next();
};

app.use(logger)

app.use("/venues", venuesRouter);
app.use("/users", usersRouter)

app.listen(5000, async () => {
    await initDb();
    console.log("Server started");
    console.log("Listening on port 5000");
});
