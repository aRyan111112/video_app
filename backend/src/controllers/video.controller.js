import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { client } from "../utils/redis.js"
import { User } from "../models/user.model.js"


// ---------------------Getting all the videos---------------
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType } = req.query
    //TODO: get all videos based on query, sort, pagination

    const cacheKey = `videos:p${page}:l${limit}:s${sortBy}:${sortType}`;

    // ✅ Check Redis first
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
        console.log("I ma here ", cachedData)
        return res.status(200).json(
            new ApiResponse(200, JSON.parse(cachedData), "videos from cache")
        );
    }

    const options = {
        page: page,
        limit: limit,
        // sort: { views: -1 }
        sort: {[sortBy]: sortType }
    }

    const videos = await Video.aggregatePaginate([
        {
            $match: {
                isPublished: true
            }
        },
    ], options).then( async (videos) => {

        // ✅ Save in Redis cache for 10 minutes
        await client.set(cacheKey, JSON.stringify(videos), { EX: 600 });
        console.log("Done")

        return res.status(200).json(
            new ApiResponse(202, videos, "videos fetched successfully")
        );

    }). catch((error) => {
        console.log(error);
        throw new ApiError(400, "Could not get videos")
    })
})

// -----------------------Publishing a video------------------------------
const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const thumbnailLocalPath = await req.files?.thumbnail[0]?.path

    console.log(thumbnailLocalPath)
    
    const videoLocalPath = await req.files?.videoFile[0]?.path

    if (!thumbnailLocalPath || !videoLocalPath) {
        throw new ApiError(400, "thumbnail and video are equired")
    }

    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const uploadedVideo = await uploadOnCloudinary(videoLocalPath)

    if (!uploadedThumbnail || !uploadedVideo) {
        throw new ApiError(400, "thumbnail and video are equired")
    }

    console.log(uploadedVideo)

    const video = await Video.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        title,
        description,
        duration: uploadedVideo.duration,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(500, "Sorry! video was not uploaded due to some technical reasons")
    }

    await client.del("videos:*")
    .then(() => {
        console.log("🗑 Redis cache cleared!")

    });


    return res.status(200).json(
        new ApiResponse(200, video, "Video uploaded successfully")
    )

})

// ----------------------getting video by Id--------------------
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!videoId) {
        throw new ApiError(400, "videoId is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "Video is not available")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Channel fetched successfully")
    )

})


// ----------------------Updating the video------------------- 
const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    const { videoId } = req.params
    const { title, description } = req.body

    if (!videoId) {
        throw new ApiError(400, "videoId is requuired")
    }

    const thumbnailLocalPath = await req.file?.path
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    // console.log(req.file)
    // console.log(thumbnailLocalPath)
    // console.log(uploadedThumbnail)

    const video = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            description,
            thumbnail: uploadedThumbnail?.url
        }
    }, {
        new: true
    })

    if (!video) {
        throw new ApiError(400, "Video cannot be found")
    }

    await client.del("videos:*")
    .then(() => {
        console.log("🗑 Redis cache cleared!")

    });

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )
})

// ------------------Deleting a video-----------------------
const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video was not found")
    }

    const video = await Video.findByIdAndDelete(videoId)

    // if(!video) {
    //     throw new ApiError(400, "video was not found")
    // }

    await client.del("videos:*")
    .then(() => {
        console.log("🗑 Redis cache cleared!")

    });

    return res.status(200).json(
        new ApiResponse(200, "video was deleted successfully")
    )
})

// --------------------------Toggleing publish status----------------
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video was not found")
    }

    const togglepublish = await Video.findByIdAndUpdate(videoId , [{
        $set: {
            isPublished: {
                $not: "$isPublished"
            }
        }
    }], {
        new: true
    })

    await client.del("videos:*")
    .then(() => {
        console.log("🗑 Redis cache cleared!")

    });


    return res.status(200).json(
        new ApiResponse(200, togglepublish, "publish status changed")
    )
})

// -----------------------add to watch history----------------------------
const addToWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;   // video user clicked on
    const userId = req.user._id;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Remove existing entry (avoid duplicates)
    await User.updateOne(
        { _id: userId },
        { $pull: { watchHistory: videoId } }
    );

    // Add new entry at the START of array
    await User.updateOne(
        { _id: userId },
        { $push: { watchHistory: { $each: [videoId], $position: 0 } } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video added to watch history"));
});


export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus, addToWatchHistory };




