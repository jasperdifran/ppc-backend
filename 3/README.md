# CRUD Operations

So far we have only looked at two types of requests, GET and POST. In this exercise, we will want to flesh these out a little bit more and also take a look at  the other two types of request, UPDATE and REMOVE. CRUD stands for Create, Read, Update and Delete, each of these corresponding to a type of request. Usually a backend would implement all of these.

## GET
Let us begin by giving us the option to collect ALL venues. Right now we can only find one by name. An easy way to do this would check if a query paramter is passed to our `/venues` GET route, and if not then return all venues. Hmm, there are a few ways we could do this, I'm thinking like this:

```javascript
    let item = undefined
    if (req.query.name) {
        item = await Venue.find({ name: req.query.name })
    } else {
        item = await Venue.find()
    }
    res.send(item || { "error": "Not found!" })
```

Now let's try running our server and making a GET request to `http://localhost:5000/venues?name=crumbs` ... success! How about without the query parameter?

Excellent, so now we can collect a list of all venues, or a venue that matches the `name` query parameter.

But a venue's name doesn't have to be unique, for example if one of our favourite venues is McDonald's, which one are we talking about?

Instead, we want to search by the id prescribed to each object by MongoDB. For this we should use the Mongoose function `findById` like so:

```javascript
    if (req.query.id) {
        item = await Venue.findById(req.query.id)
    } else {
        item = await Venue.find()
    }
```

Now test it out! You can get object ids from first collecting all documents (not passing any query params) then making another request with an `id` query parameter.

## PUT
The PUT request corresponds to the UPDATE operation. Create a new route, this time make it a `put` route to the `/venues` route and with an async callback function.

Inside this route body, the main function we want to invoke is `col.updateOne`. The following line accomplishes this:

```javascript
await Venue.findByIdAndUpdate(req.query.id, req.body)
```

The first argument is our venue id, so we set that to the id passed to the route. The second argument indicates our update operation, anything passed in the second argument will get updated. This is a tad bit unsafe, but we are saying that anything passed to the request body should update a venue. Imagine we passed the following:

```json
{
    "name": "New Crumbs",
    "rating": 4.7
}
```

Then we would update both the name and rating of "crumbs" to these new values. Make sure you do a `res.send` with an appropriate message to indicate to the client it has been successful!

## DELETE
Finally, let's try out the DELETE route. We can simply copy and paste the function body from the PUT route, but change the `findByIdAndUpdate` to `findByIdAndDelete` and remove the second argument. 

```javascript
app.delete("/venues", async (req, res) => {
    await Venue.findByIdAndDelete(req.query.id)
    res.send({ "message": "success!" })
});
```

Now try starting your server and sending a delete request with an `id` query parameter. If you then try and get the full list of venues you should find one of them missing.
