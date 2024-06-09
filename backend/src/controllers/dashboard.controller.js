import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const result = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "views",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            views: {
                                $sum: "$views"
                            }
                        }
                    },
                    {
                        $project: {
                            views: 1
                        }
                    }   
                ]
            }
        },
        {
            $unwind: "$views"
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
            }
        },
        // for likes
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videoLikes",
                pipeline: [
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "video",
                            as: "likes"
                        }
                    },
                    {
                        $unwind: "$likes"
                    },
                    {
                        $project: {
                            likes: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscribers: {
                    $size: "$subscribers"
                },
                videos: {
                    $size: "$videos"
                },
                videoLikes: {
                    $size: "$videoLikes"
                }

            }
        },
        {
            $project: {
                subscribers: 1,
                views: 1,
                videos: 1,
                videoLikes: 1
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(205, result, "channel details fetched")
    )

})


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(201, videos, "Videos fetched")
    )
})

export {
    getChannelStats,
    getChannelVideos
} 