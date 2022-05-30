const usersRouter = require('express').Router()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { getUsers, getVenues } = require('../db');

require('dotenv').configure()

usersRouter.post('/signup', async (req, res) => {
    // Check for missing parameters
    if (!req.body.username || !req.body.password) {
        res.status(400).send({ error: "Failed! Missing username or password" })
        return;
    }

    // Collect our users collection
    let users = await getUsers()

    // Check if this user already exists
    let exists = await users.findOne({ username: req.body.username })
    if (exists) {
        res.status(409).send({ error: "Username taken!" })
        return;
    }

    // Get salt
    let salt = crypto.randomBytes(16).toString('hex')

    // Initialise hash object
    let hash = crypto.createHmac('sha512', salt)

    // Combine password into hash
    hash.update(req.body.password)

    // Convert hash object to string
    let hashed = hash.digest('hex')

    let user = {
        username: req.body.username,
        salt: salt,
        pass: hashed,
        watchedVenues: []
    }

    await users.insertOne(user)

    // Create token
    let token = jwt.sign({ username: req.body.username }, process.env.SUPER_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).send({ token: token })
})

usersRouter.post('/login', async (req, res) => {
    // Check for missing parameters
    if (!req.body.username || !req.body.password) {
        res.status(400).send({ error: "Failed! Missing username or password" })
        return;
    }

    // Collect our users collection
    let users = await getUsers()

    // Check if this user already exists
    let user = await users.findOne({ username: req.body.username })
    if (!user) {
        res.status(409).send({ error: "User not found!" })
        return;
    }

    // Get salt
    let salt = user.salt

    // Initialise hash object
    let hash = crypto.createHmac('sha512', salt)

    // Combine password into hash
    hash.update(req.body.password)

    // Convert hash object to string
    let hashed = hash.digest('hex')

    if (hashed != user.pass) {
        res.status(403).send({ error: "Incorrect password!" })
        return;
    }

    // Create token
    let token = jwt.sign({ username: user.username }, process.env.SUPER_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).send({ token: token })

});

module.exports.usersRouter = usersRouter