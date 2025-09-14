import express from "express"
import { verifyToken } from "../Middlewares/AuthMiddleware.js";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../Controller/watchlistControllers.js";



const watchlistRoutes = express.Router();

watchlistRoutes.post("/AddWatchlist",verifyToken,addToWatchlist);
watchlistRoutes.get("/GetWatchlist",verifyToken,getWatchlist);
watchlistRoutes.post("/removeWatchlist",verifyToken,removeFromWatchlist);


export default watchlistRoutes;