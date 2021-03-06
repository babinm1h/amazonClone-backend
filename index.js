import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { router } from "./routes/index.js"
import cookieParser from "cookie-parser"
import { passport } from "./utils/passport.js"
import bodyParser from "body-parser"

const origins = [
    "https://effulgent-cuchufli-62f90c.netlify.app",
    `http://localhost:3000`,
]


const app = express()
const PORT = process.env.PORT || 7777


app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(cors({
    credentials: true,
    origin: origins
}))
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        if (!req.headers['stripe-signature']) {
            return
        }
        req.rawBody = buf.toString()
    }
}))
app.use(`/serv`, router)





const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        app.listen(PORT, () => console.log(PORT + " started"))
    } catch (e) {
        console.log(e);
    }
}
start()