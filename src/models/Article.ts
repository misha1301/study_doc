import {NextFunction} from "express";

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdDate: {
        type: Date,
        default: Date
    },
    updatedDate: {
        type: Date,
        default: undefined
    },
    accessibility: {
        type: String,
        enum: ["Private", "Shared", "Public"],
        default: "Private"
    },
    tags: {
        type: [String]
    },
    numberOfReviews: {
        type: Number,
        default: 0,
        min: 0
    },
    numberOfSavings: {
        type: Number,
        default: 0,
        min: 0
    },
    viewers: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    savings: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    article: {
        type: String,
        required: true,
        maxLength: [50, "An article title mast have less or equal then 50 characters"]
    },
    articleContent: {
        type: [{
            id: {
                type: String,
                required: true,
            },
            contentOrder: {
                type: Number,
                required: true,
                min: [0, "Order number can`t be lower than 0"]
            },
            contentType: {
                type: String,
                enum: ["Text", "List", "Img", "Code", "Line", "Ref",],
                required: true
            },
            style: {
                color: String,
                border: String,
                textSize: String,
                weight: String,
            },
            content: {
                type: [String],
                required: true
            }
        }],
        required: true
    }
});

// Or with regex /.*update.*/i which triggered by any mongoose update methods
articleSchema.pre("findOneAndUpdate", function(next){
    this.set({ updatedDate: new Date() });
    next();
});

const Article = mongoose.model("Article", articleSchema);
export default Article;