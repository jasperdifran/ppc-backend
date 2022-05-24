# Authentication
Authentication is a big part of almost every web application

For our app, we are going to use authentication middleware called Passport. Passport was made to simplify the process of adding authentication to a web app.

To start, run the command `npm install passport passport-jwt passport-local jsonwebtoken`.
- `passport`: The main package controlling Passport JS
- `passport-jwt`: Strategy for us to do authentication while users are already logged in
- `passport-local`: Strategy to assist with loggin in/signing up
- `jsonwebtoken`: Helps with handling JSON Web Tokens

## Refactoring
We will need to start by moving around and refactoring some of our code to make it easier to understand. Right now we have it all sitting in one file "index.js".

We want our new directory structure to look like so:

```
venuesWatcher/
    routes/
        users.js
        venues.js
    strategies/
        JwtStrategy.js
        LocalStrategy.js
    index.js
    db.js
    authenticate.js
    package.json
```

Try and replicate this in your project directory, all files but for `index.js` and `package.json` should be empty.

### Database
Let's first fill in the database file. Our `db.js` should look like the following:

```javascript
const { MongoClient } = require('mongodb');

const url = YOUR_MONGODB_CONNECTION_URL
let client = new MongoClient(url);

let db = undefined;
let userscol = undefined;
let venuescol = undefined;

const initDb = async () => {
    if (!db) await client.connect();
    db = client.db('venueWatcher');
    return db
}

const getUsers = async () => {
    if (!db) await initDb();
    if (!userscol) userscol = db.collection('users')
    return userscol;
}

const getVenues = async () => {
    if (!db) await initDb();
    if (!venuescol) venuescol = db.collection('venues')
    return venuescol;
}

module.exports.initDb = getDb
module.exports.getVenues = getVenues;
module.exports.getUsers = getUsers
```

Breaking this down a bit, we are initialising a new MongoClient with our database cluster URL. Then we have defined some functions which will connect to our database. initDB just checks if we have already connected and have a database object in the `db` variable, if not then it connects and sets it. `getUsers` and `getVenues` do very similar things, just check if there is already a venues or users collection and if not creates them.

Down the bottom of the file we have 3 lines to export these functions.

### Venues routes
Our `venues.js` file in our `routes` directory contains all routes to do with venues, shocker. The file should look like the following:

```javascript
const venuesRouter = require('express').Router()
const { getUsers, getVenues } = require('./db');

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
```

This has been mostly copy-pasted from `index.js` with a couple of adjustements to accomodate the changes made to database interaction.

Notice we have changed the name of `router` to `venuesRouter`. This makes it a bit more clear which routes belong where when we add in another router to handle user routes.

### Index
Our `index.js` file is now greatly simplified from before. It should look like the following:

```javascript
const express = require('express')
const { initDb } = require("./db");
const { venuesRouter } = require('./routes/venues')

var app = express();

app.use(express.json())

app.use("/venues", venuesRouter);

app.listen(5000, async () => {
    await initDb();
    console.log("Server started");
    console.log("Listening on port 5000");
});
```

Notice we now have the line `app.use("/venues", venuesRouter)`. This means that all routes defined in `venuesRouter` will be prefixed with `/venues`. This helps us to ensure there are no collisions with routes and clearly define the purpose of each route.

Good, all our code should now be in the correct spot and we can start building up our authentication process. Try adding some venues to our database using a POST request to the route `http://localhost:5000/venues`, then try collecting all of our venues using a GET request to the same url.

## Authentication
### 


This authentication is loosely based on [this project](https://github.com/collegewap/mern-auth-server).
