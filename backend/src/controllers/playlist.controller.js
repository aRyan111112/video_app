import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const {name, description} = req.body

    if (!name || !description) {
        throw new ApiError(400, "You need to provide a name and a description to create playlist")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    res.status(200).json(
        new ApiResponse(202, playlist, "Playlist created")
    )

})


const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const {userId} = req.params

    if (!userId) {
        throw new ApiError(400, "You need to provide userId")
    }

    const userPlaylists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(203, userPlaylists, "All the playlists of user are feched")
    )
})


const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    const {playlistId} = req.params

    if (!playlistId) {
        throw new ApiError(400, "You need to provide playlistId")
    }
    
    const playlist = await Playlist.findById({
        _id: playlistId
    })

    res.status(200).json(
        new ApiResponse(205, playlist, "playlist feched")
    )
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(400, "You need to provide all information")
    }

    const existingVideoInPlaylist = await Playlist.findOne({
        _id: playlistId,
        videos: videoId
    })

    if (existingVideoInPlaylist) {
        throw new ApiError(400, "This video already exists in playlist")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId,{
        $push: {
            videos: videoId
        }
    }, {
        new: true
    })

    res.status(200).json(
        new ApiResponse(205, playlist, "Video added")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    const {playlistId, videoId} = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(400, "You need to provide all information")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId,{
        $pull: {
            videos: videoId
        }
    }, {
        new: true
    })

    res.status(200).json(
        new ApiResponse(205, playlist, "Video removed")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    const {playlistId} = req.params

    if (!playlistId) {
        throw new ApiError(400, "Provide playlistId")
    }

    await Playlist.findByIdAndDelete(playlistId)

    res.status(200).json(
        new ApiResponse(201, "Playlist deleted")
    )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    const {playlistId} = req.params
    const {name, description} = req.body

    if (!name && !description) {
        throw new ApiError(400, "Provide name or description")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        name,
        description
    }, {
        new: true
    })

    res.status(200).json(
        new ApiResponse(201, updatedPlaylist, "Playlist updated")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}