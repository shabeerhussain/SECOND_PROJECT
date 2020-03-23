const mongoose = require('mongoose');

const Trip = mongoose.model("trips", {
    title: String,
    start: Date,
    end: Date,
    address: String,
    creator: {
        type : mongoose.Types.ObjectId,
        ref: 'users'
    },
})

module.exports = Trip;