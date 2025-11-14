import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToWatchHistory, deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/get-video").get(verifyJWT, getAllVideos)
router.route("/publish-video").post(verifyJWT, upload.fields([
    {
        name: "thumbnail",
        maxCount: 1
    },
    {
        name: "videoFile",
        maxCount: 1
    }
    
]), publishAVideo)

router.route("/get-video-by-id/:videoId").get(verifyJWT, getVideoById)
router.route("/update-video/:videoId").patch(verifyJWT, upload.single('thumbnail'), updateVideo)
router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo)
router.route("/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus)
router.post("/watch-history/:videoId", verifyJWT, addToWatchHistory);

export default router;