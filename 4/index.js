const express = require('express')
const venuesRouter = require('./routes/venues')
const userRouter = require('./routes/users')
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require('cors')

require('dotenv').config()

// Connect to database
require('./db')

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

var app = express();

app.use(express.json())
app.use(cors())

app.use("/venues", venuesRouter);
app.use('/users', userRouter)

app.listen(process.env.PORT || 5000, async () => {
    console.log(`App started at port: ${process.env.PORT || 5000}`)
});
