# MongoDB
In this exercise, we will be building upon the backend server we created in the previous exercise - []insertname[] - but we will switch to using MongoDB to store data.

MongoDB is a noSQL database with a generious free tier. It is often used for small hobby projects, but is more than capable of managing data for huge applications.

## Setting up
To start, follow the first 4 steps [in this guide](https://www.mongodb.com/docs/atlas/getting-started/). Also on there you will find all the documentation for using MongoDB, we will be referring back to it a lot during this exercise.

Once you have created an account and launched an Atlas cluster, navigate to the database deployment dashboard. You should see your cluster there. It might still be launching but once it's done, click the `Connect` button and select `Connect your application`.

You should see a connection string there, mine looks like this `mongodb+srv://jasperdif:<password>@cluster0.3jv0w.mongodb.net/?retryWrites=true&w=majority`. If you have something like that, congrats! We will come back to it later.

We will also be requiring the `mongodb` package for this, so navigate to the directory with your `package.json` and run the command `npm install mongodb mongoose`.

The mongoose package is the main one we will use for interacting with the database. 

## Connecting to MongoDB
Firstly import mongoose using the line.

```javascript
const mongoose = require('mongoose');
```

Next, we must delete our old database from our code, as in remove the `database` variable. We will replace it with the following line.

```javascript
const url = 'YOUR_CONNECTION_STRING'
```

Let's walk through this, we are getting our connection string from earlier, replacing the `<password>` section in it with our password and saving it as a constant value. However we do want to make one other adjustment to our connection URL. It should look something like this: 

```
mongodb+srv://jasperdif:<password>@cluster0.3jv0w.mongodb.net/?retryWrites=true&w=majority
```

But we want it to look like this 
```
mongodb+srv://jasperdif:<password>@cluster0.3jv0w.mongodb.net/venueWatcher?retryWrites=true&w=majority'
```

The difference being `venueWatcher` after the MongoDB host name. This ensures we connect to the database called `venueWatcher` inside our cluster.

Now we want to change our `app.listen` functionality a little bit. We will be introducing an `await` statement so we firstly need to convert the function we pass to `app.listen` to be asynchronous. Then we connect mongoose and once that has finished we print some success messages, like so:

```javascript
app.listen(5000, async () => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Server started");
        console.log("Listening on port 5000");
    })
});
```

Looks good! We have changed this function to be asynchronous, added in the `await` statement which just means we will stop execution until we have connected and we have actually connected to the database.

Now try running `npm start`. If there's a little bit of a delay and then you get the success messages, good job! You have successfully connected to your Atlas cluster.

## Creating a database
The heirarchy of data in MongoDB is as such, clusters store databases which store collections which store documents. So far we have connected mongoose to our venuesWatcher database. If this database already existed we would connect to the existing one, otherwise we create a new one.

## Using MongoDB
Now that we have a more sophisticated database, we are going to change our data structure. For each venue we want to store a few fields in the following format:

```json
{
    "name": "crumbs",
    "tags": ["cafe", "quick-eats"],
    "address": "405 High Street, Randwick NSW 2031",
    "notes": "Nice little cafe, affordable and excellent service.",
    "visits": 12,
    "rating": 4.5,
}
```

However, we also want to maintain this structure in our database. Right now it would be a nuisance to check whether or not each incoming request has each of these fields. So, we are gonig to use Mongoose to handle this for us. Now, make a new folder in our root called `models`, and inside that create a file called `venue.js`. Fill this file with the following lines:

```javascript
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Venue = new Schema({
    name: {
        type: String,
        default: "",
    },
    tags: {
        type: [String],
        default: [],
    },
    address: {
        type: String,
        default: "",
    },
    notes: {
        type: String,
        default: "",
    },
    visits: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model("Venue", Venue)
```

As you can see we are importing `mongoose`, creating a schema (template for documents in a collection), defining each of the fields in our `Venue` schema then exporting it under the name `"Venue"`.

Our `index.js` will also require a few additions. Below is how I have written `index.js`. Take note of the function we are using to add to the database (`item.save()`) and what we are using to search (`Venue.find().exec()`). The `exec` is simply forcing the query to be executed, as opposed to being returned a cursor. 

```javascript
const express = require('express')
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Venue = require('./models/venue');

var app = express();
var router = express.Router();

const url = YOUR_MONGODB_STRING

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
    let c = mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    c.then(() => {
        console.log("Server started");
        console.log("Listening on port 5000");
    })
});
```

Notice we have added the keyword `async` in front of the route callback functions, allowing us to use `await` and other asynchronous operations.

Try running your server again and adding in the example venue from earlier, then try searching for a venue with the name "crumbs". You might also notice an "id" field, MongoDB is very kind and automatically adds a unique ID to each document. 

Good job! To sum up, now we have connected to our cluster, created a model for venues, and connected our routes to properly interact with the model and find/add venues.

How might we write a route which would get all venues with a rating of 3? With a rating *greater* than 3? I'll leave these as an exercise to you, the [MongoDB documentation](https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/) and the [Mongoose Documentation](https://mongoosejs.com/) might help.
