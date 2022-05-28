const mongoose = require('mongoose')
const url = 'mongodb+srv://jasperdif:2Rtyz501@cluster0.3jv0w.mongodb.net/venueWatcher?retryWrites=true&w=majority'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Server started");
    console.log("Listening on port 5000");
})