import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Comment } from "../models/comment.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if (!videoId) {
        throw new ApiError(400, "requires video Id")
    }

    let videoLike = await Like.findOne({
        video: videoId,
        likedBy: req.user
    })

    if (videoLike) {
        await Like.findOneAndDelete({
            video: videoId
        })

        res.status(200).json(
            new ApiResponse(202, "Like removed from video" )
        )
    } else {
        let likeVideo = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        res.status(200).json(
            new ApiResponse(202, likeVideo, "Video liked" )
        )
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const {commentId} = req.params

    if (!commentId) {
        throw new ApiError(402, "Requires comment")
    }

    const existingComment = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if (existingComment) {
        await Like.findOneAndDelete({
            comment: commentId
        })

        res.status(200).json(
            new ApiResponse(202, "Like removed from comment")
        )
    } else {
        const commmentLike = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        res.status(200).json(
            new ApiResponse(202, commmentLike, "Comment liked")
        )
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {tweetId} = req.params

    if (tweetId) {
        throw new ApiError(402, "Requires tweet")
    }

    const existingLikedTweet = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if (!existingLikedTweet) {
        const likedTweet = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })

        res.status(200).json(
            new ApiResponse(202, likedTweet, "Tweet liked")
        )
    } else {
        await Like.findOneAndDelete({
            tweet: tweetId,
            likedBy: req.user._id
        })
    }

    res.status(200).json(
        new ApiResponse(202, "Like removed from tweet")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    try {
        const allLikedVideos = await Like.aggregate([
            {
                $match: {
                    likedBy: req.user._id
                },
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "likedVideos",
                }
            },
            {
                $unwind: "$likedVideos"
            },
            {
                $replaceRoot: { newRoot: "$likedVideos" }
            }
        ])
    
        res.status(200).json(
            new ApiResponse(203, allLikedVideos, "All the liked videos fetched successfully.")
        )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching the videos")
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}