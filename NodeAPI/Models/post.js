const mongoose=require('mongoose');
const user = require('./user');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    photo: {
        type: Buffer,
        contentType: String
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    created:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post",postSchema);