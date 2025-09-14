import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import mongoose from "mongoose";
import AuthRoutes from "./Routes/authRoutes.js";
import MoviesRoutes from "./Routes/moviesRoutes.js";
import fileUpload from "express-fileupload";
import reviewRoutes from "./Routes/reviewRoutes.js";
import watchlistRoutes from "./Routes/watchlistRoutes.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true
}));
app.use("/upload",express.static('Uploads'));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.ORIGIN,process.env.ADMIN_ORIGIN], // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If using cookies/auth headers
}))

app.listen(PORT,() => {
    console.log("App is listening on the port 8747");
})

app.get("/",(req,res)=>{
    res.send("Server is running");
})

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}

main().then(() => {
    console.log("Connected to DB");
}).catch((err) =>{ 
    console.log(err);
})


app.use("/api/auth",AuthRoutes);
app.use("/api/movies",MoviesRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/watchlist",watchlistRoutes);


