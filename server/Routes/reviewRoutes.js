import express from "express"
import { addReview, GetReview } from "../Controller/reviewControllers.js";



const reviewRoutes = express.Router();


reviewRoutes.post("/movies/:id/AddReview",addReview);
reviewRoutes.get("/movies/:id/GetReview",GetReview);


export default reviewRoutes;