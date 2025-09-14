import express from "express"
import { getUserInfo, login, Logout, signup,updateUserInfo } from "../Controller/authControllers.js";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";


const AuthRoutes = express.Router();


AuthRoutes.post("/signup",signup);
AuthRoutes.get("/user-info",verifyToken,getUserInfo);
AuthRoutes.patch("/update-info",verifyToken,updateUserInfo);
AuthRoutes.post("/login",login);
AuthRoutes.get("/logout",Logout);


export default AuthRoutes;