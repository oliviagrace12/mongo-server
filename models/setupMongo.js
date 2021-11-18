const mongoose = require('mongoose')
const uri = process.env.DB_URI;
function connect() {
    const options = { useNewUrlParser: true }
    mongoose.connect(uri, options).then(
        () => { console.log("Database connection established") },
        err => { console.log("Error connecting to database instance: ", err) }
    )
}

module.exports = connect