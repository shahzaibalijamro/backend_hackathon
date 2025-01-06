import express from "express"
import {  deleteUser, getAllUsers, loginUser,registerUser,resetPassword, updateFullNameOrUserName, updateProfilePicture} from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyRequest } from "../middlewares/auth.middelware.js";
const userRouter = express.Router();

//get all users
userRouter.get("/all",getAllUsers)

//register User
userRouter.post("/register", upload.single("image"), registerUser)

//login User
userRouter.post("/login", loginUser)

//delete User
userRouter.delete("/delete", verifyRequest, deleteUser)

//update Username or Fullname
userRouter.put("/update",verifyRequest, updateFullNameOrUserName)

//update profile picture
userRouter.put("/pfp",verifyRequest, upload.single("image"), updateProfilePicture)

//reset Password
userRouter.put("/reset",verifyRequest, resetPassword)

export { userRouter }