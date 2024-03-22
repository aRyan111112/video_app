import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler( async (req, res) => {

    // get user details from frontend
    // validate - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refreshToken field from response
    // check for user creation
    // return res

    const {fullName, email, username, password} = req.body
    // console.log("fullName: ", fullName) 

    //checking if any field is empty
    if ([fullName, email, username, password].some((fields) => fields?.trim() === "" )) {
        throw new ApiError(400, "Please fill all the details") 
    }

    console.log(req.body)

    // check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists.")
    }

    const avatarLocalPath = await req.files?.avatar[0]?.path;
    console.log("path is:" , avatarLocalPath)

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required par file to h")
    }

    // const coverImageLocalPath = await req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    console.log(coverImageLocalPath)

    console.log(req.files)



    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username
    })

    // console.log(user)

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    console.log("created user: ", createdUser)

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully.")
    )
})  

export {registerUser};