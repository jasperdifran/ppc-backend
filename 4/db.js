const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://jasperdif:2Rtyz501@cluster0.3jv0w.mongodb.net/?retryWrites=true&w=majority'
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

module.exports.initDb = initDb
module.exports.getVenues = getVenues;
module.exports.getUsers = getUsers
