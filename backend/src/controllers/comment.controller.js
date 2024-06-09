import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const options = {
        page: page,
        limit: limit
    }

    try {
        const commentsOnVideo = await Comment.aggregatePaginate([
            {
                $match: {
                    video: videoId,
                    owner: req.user._id
                }
            }
        ], options)

        res.status(200).json(
            new ApiResponse(205, commentsOnVideo, "all the comments on this video are fetched")
        )

    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching comments on this video")
    }

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body

    try {
        const addComment = await Comment.create({
            content,
            video: videoId,
            owner: req.user._id
        })

        res.status(200).json(
            new ApiResponse(201, addComment, "Added comment on the video")
        )

    } catch (error) {
        
        throw new ApiError(500, "Something went wrong while adding the comment")
    }

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        )
    
        res.status(200).json(
            new ApiResponse(206, updatedComment, "Comment updated successfully")
        )

    } catch (error) {
        throw new ApiError(506, "Something went wrong while updating the comment")
    }

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    try {

        await Comment.findByIdAndDelete( commentId )

        res.status(200).json(
            new ApiResponse(203, "Comment deleted")
        )

    } catch (error) {     
        throw new ApiError(500, "Something went wrong while deleting the comment")
    }
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }