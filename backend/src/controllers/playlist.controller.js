import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const { name, description } = req.body

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
    const { userId } = req.params

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
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate({
            path: 'videos',
            populate: {
                path: 'owner',
                select: 'fullName username avatar'
            }
        })
        .populate('owner', 'fullName username avatar');

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    );
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

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

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
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
    const { playlistId, videoId } = req.params;

    if (!mongoose.isObjectIdOrHexString(playlistId) || !mongoose.isObjectIdOrHexString(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id,
            videos: videoId
        },
        {
            $pull: { videos: videoId }
        },
        {
            new: true,
            runValidators: true
        }
    );

    // Handle missing playlist, unauthorized access, or a video that isn't in the playlist
    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist or video not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Video removed successfully"
        )
    );
});



const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.isObjectIdOrHexString(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Delete only if the authenticated user owns it
    const deletedPlaylist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user._id
    });

    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { playlistId: deletedPlaylist._id },
            "Playlist deleted successfully"
        )
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!mongoose.isObjectIdOrHexString(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        throw new ApiError(400, "Invalid request body");
    }

    const allowedFields = ["name", "description"];

    if (Object.keys(req.body).some(key => !allowedFields.includes(key))) {
        throw new ApiError(400, "Unexpected update field");
    }

    const updates = {};

    if (name !== undefined) {
        if (typeof name !== "string") {
            throw new ApiError(400, "Name must be a string");
        }

        const trimmedName = name.trim();

        if (trimmedName.length < 1 || trimmedName.length > 100) {
            throw new ApiError(400, "Name must be between 1 and 100 characters");
        }

        updates.name = trimmedName;
    }

    if (description !== undefined) {
        if (typeof description !== "string") {
            throw new ApiError(400, "Description must be a string"
            );
        }

        const trimmedDescription = description.trim();

        if (trimmedDescription.length > 2000) {
            throw new ApiError(400, "Description cannot exceed 2000 characters"
            );
        }

        updates.description = trimmedDescription;
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "Provide name or description"
        );
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $set: updates
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"
        )
    );
});


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}