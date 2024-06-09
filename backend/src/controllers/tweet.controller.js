import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create 
    const { content } = req.body;
     
    if (!content) {
        throw new ApiError(400, "Provide content")
    }

    const createdTweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    res.status(200).json(
        new ApiResponse(205, createdTweet, "tweet created")
    )
})


const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "Provide userId")
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId( userId )
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(201, tweets, "tweets fetched")
    )
})


const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId) {
        throw new ApiError(400, "Provide tweetId")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
        content
    }, {
        new: true
    })

    res.status(200).json(
        new ApiResponse(209, updatedTweet, "tweet updated")
    )
})


const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "Provide tweetId")
    }

    await Tweet.findByIdAndDelete(tweetId)

    res.status(200).json(
        new ApiResponse(204, "tweet deleted")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}