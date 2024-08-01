const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        select: false,
        unique: true,
        required: [true, "Email is required!"],
        maxlength: [50, "An email mast have less or equal then 50 characters"]
    },
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required!"],
        maxlength: [20, "Username mast have less or equal then 20 characters"],
        minlength: [4, "Username mast have more or equal then 4 characters"]
    },
    password: {
        type: String,
        select: false,
        required: [true, "Password is required!"],
        maxlength: [20, "Password mast have less or equal then 20 characters"],
    },
    imgURL: {
        type: String,
        default: undefined
    },
    connectionList: [{
        type: [mongoose.Schema.ObjectId],
        ref: "User"
    }],
    gitHubLink: {
        type: String,
        default: undefined
    },
    roles: {
        type: String,
        enums: ["Admin", "User"],
        default: "User",
        mutable: false
    },
    registerDate: {
        type: Date,
        default: Date.now,
    },
    lastActiveDate: {
        type: Date,
        default: undefined,
    },
    refreshToken: String,
    preferences: {
        language: {
            type: String,
            default: "en"
        },
        theme: {
            type: String,
            default: "System"
        },
        notification: {
            type: Boolean,
            default: true
        }
    }
});

module.exports = mongoose.model("User", userSchema);