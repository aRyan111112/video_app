import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: ""
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", playlistSchema)