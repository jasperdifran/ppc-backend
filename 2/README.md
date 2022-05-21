# MongoDB
In this exercise, we will be building upon the backend server we created in the previous exercise - []insertname[] - but we will switch to using MongoDB to store data.

MongoDB is a noSQL database with a generious free tier. It is often used for small hobby projects, but is more than capable of managing data for huge applications.

## Setting up
To start, follow the first 4 steps [in this guide](https://www.mongodb.com/docs/atlas/getting-started/). Also on there you will find all the documentation for using MongoDB, we will be referring back to it a lot during this exercise.

Once you have created an account and launched an Atlas cluster, navigate to the database deployment dashboard. You should see your cluster there. It might still be launching but once it's done, click the `Connect` button and select `Connect your application`.

You should see a connection string there, mine looks like this `mongodb+srv://jasperdif:<password>@cluster0.3jv0w.mongodb.net/?retryWrites=true&w=majority`. If you have something like that, congrats! We will come back to it later.

We will also be requiring the `mongodb` package for this, so navigate to the directory with your `package.json` and run the command `npm install mongodb`.

## Connecting to MongoDB
Firstly import the MongoClient using the line.

```javascript
const { MongoClient } = require('mongodb');
```

The reason we are wrapping this import in curly braces is because `MongoClient` is not the default export for `mongodb`. Read more about exports and modules [here](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export).

Next, we must delete our old database from our code, as in remove the `database` variable. We will replace it with the following few lines.

```javascript
const url = 'YOUR_CONNECTION_STRING'
let client = new MongoClient(url);
```

Let's walk through this, we are getting our connection string from earlier, replacing the `<password>` section in it with our password and saving it as a constant value. Next we are instantiating a new MongoDB client with our connection string. This `MongoClient` is what will manage our connections to the database.

Now we want to change our `app.listen` functionality a little bit. We will be introducing an `await` statement so we firstly need to convert the function we pass to `app.listen` to be asynchronous. Then we want to call the `connect` method on our client. The `listen` function should look a little bit like this

```javascript
app.listen(5000, async () => {
    await client.connect();
    console.log("Server started");
    console.log("Listening on port 5000");
});
```

Looks good! We have changed this function to be asynchronous, added in the `await` statement which just means we will stop execution until we have connected and we have actually connected to the database.

Now try running `npm start`. If there's a little bit of a delay and then you get the success messages, good job! You have successfully connected to your Atlas cluster.

## Creating a database
The heirarchy of data in MongoDB is as such, clusters store databases which store collections which store documents. We have so far connected to the cluster, now we want to make a database inside that cluster.

Make two variables near the top of your `index.js` called `venuesdb` and `venuescollection` and set them to `undefined`. Surprise, they will hold our `venues` database and collection. After we have connected to our client in the `app.listen` function, we can create a new database and collection inside that database then save them to our variables with the following two lines:

```javascript
    venuesdb = client.db('venues');
    venuescollection = db.collection('venues');
```

It is important to keep in mind that if you already had a database named 'venues' this will give you a connection to that, if not then it will create one.

## Using MongoDB
### Inserting
Inserting documents (some JSON data) into a MongoDB collection is incredibly easy. To do this, let's change our `POST` route.

```javascript
app.post("/venues", async (req, res) => {
    await col.insertOne(req.body)
    res.send("Success");
});
```

Notice we have made 2 changes here, the function has become asynchronous so we put `async` before the parameters. Next we have swapped out `Object.assign` for the MongoDB `insertOne` function.

Now that we have a more sophisticated database, we are going to change our data structure. Now, in our venues collection we will want to store venues in the following format:

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

So now, when we send a POST request to our server to add in a new cafe, it should have all of these fields in it.

Excellent, run your server and send a post request similar to the first exercise but with our new JSON format to add in another venue. You should get a success message on your console.


### Finding
Finding documents can get a little bit trickier. First we establish a `query` object describing what we want to find in the database. Then we pass that `query` object to the `findOne` or `find` functions, depending on if we want all results that match returned or just one.

```javascript
app.get("/venues/:name", async (req, res) => {
    let query = { name: req.params.name };
    let item = await col.findOne(query);
    res.send(item || {"error": "Not found!"})
});
```

Firstly make sure the GET request is asynchronous, else we can't use `await`. Then we want to build our `query` object by telling MongoDB "find things that have a name field the same as `req.params.name`". Then we collect the item from our database. `findOne` will return `null` if no documents matched the query, so in our send we attempt to return `item` but if it's null (or undefined) then we return a helpful error message.

Good job! To sum up, now we have connected to our cluster, created a database, created a collection within that database and added some venues to it. We can also find a venue which matches a name parameter!

How might we write a route which would get all venues with a rating of 3? With a rating *greater* than 3? I'll leave these as an exercise to you, the [MongoDB documentation](https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/) might help.
