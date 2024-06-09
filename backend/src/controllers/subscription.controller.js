import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription

    const {channelId} = req.params
    const subscriberId = String(req.user._id)

    if (channelId === subscriberId) {
        throw new ApiError(400, "You cannot subscribe yourself")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel:channelId
    })

    if (existingSubscription) {
        await Subscription.findOneAndDelete({
            subscriber: req.user._id,
            channel:channelId
        })

        res.status(200).json(
            new ApiResponse(209, {}, "Subcription removed")
        )
    } else {
        const addSubscription = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })

        res.status(200).json(
            new ApiResponse(209, addSubscription , "Subcription added")
        )
    }
})


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    console.log(channelId)
    console.log("worked till here")


    const AllSubscribers = await Subscription.aggregate([
        {
            $match : {channel: new mongoose.Types.ObjectId(channelId)}
        },
        {
            $lookup:{
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "Subscribers",
            }
        },{
            $project: {
                Subscribers: 1
            }
        }
    ])


    res.status(200).json(
        new ApiResponse(203, AllSubscribers, "All the subscriber of this are fetched")
    )
})


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    console.log(subscriberId)

    const channelsSubscribed = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            },
        },
        {
            $lookup:{
                from:"users",
                localField: "channel",
                foreignField: "_id",
                as: "ChannelsSubscribed"
            }
        },{
            $project: {
                ChannelsSubscribed: 1
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(203, channelsSubscribed, "All the channels to which user has subscribed are fetched")
    )
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}