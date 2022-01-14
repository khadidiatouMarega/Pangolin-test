var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    name:{ 
        type: String,
        required: true,
        min: 6,
        max: 255 
    },
    email: { 
        type: String,
        required: true,
        max: 255, 
        min: 6
    },
    password: { 
        type: String,
        required: true,
        max: 1024, 
        min: 6
    },
    // age: { 
    //     type: Number,
    //     required: true,
    // },
    role: { 
        type: String,
        required: true,
        max: 1024, 
        min: 6
    },
    friends: [{ 
        type: mongoose.Types.ObjectId, 
        ref: 'Friends'
    }]
});
    
var User = mongoose.model("User", userSchema); 

module.exports = User