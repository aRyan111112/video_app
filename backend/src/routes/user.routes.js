import { Router } from "express";
import {loginUser, logoutUser, registerUser, getChannelProfile, getWatchHistory} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/channel/:username").get(verifyJWT, getChannelProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)

export default router;