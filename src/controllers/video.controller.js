import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


// ---------------------Getting all the videos---------------
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType } = req.query
    //TODO: get all videos based on query, sort, pagination

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
    ], options).then((result) => {
        return res.status(200).json(
            new ApiResponse(202, result, "videos fetched successfully")
        )
    }). catch(() => {
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
        duration: uploadedVideo.duration
    })

    if (!video) {
        throw new ApiError(500, "Sorry! video was not uploaded due to some technical reasons")
    }

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

    return res.status(200).json(
        new ApiResponse(200, togglepublish, "publish status changed")
    )
})

export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };




