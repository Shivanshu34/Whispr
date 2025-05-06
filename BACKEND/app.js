import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {main} from './database/dbConnection.js';
import passport from 'passport';
import User from './models/user.js';
import userRouter from './routes/user.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ExpressError from './utils/ExpressError.js';
import { errorMiddleware } from './middleware.js';
import detailRouter from './routes/details.js';
import friendRouter from './routes/friend.js';
import chatRouter from './routes/chat.js';

const app = express();
dotenv.config({ path: "./config/config.env" });  // Now we can directly access to the "variables of config.env" by "process.env"

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET","POST","PUT","DELETE"],
        credentials: true,
    })
);

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto: {
        secret: process.env.SECRET_CODE,
    },
    touchAfter: 24*3600,
});

store.on("error", (err)=>{
    console.log("There is an error on Mongo store seesions", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET_CODE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000*60*60*24*14),
        maxAge: 1000*60*60*24*14,
        httpOnly: true,
    }
}

app.set('trust proxy',1);
app.use(session(sessionOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
    .then(()=>{
        console.log("database connected");
    })
    .catch((err)=>{
        console.log(err);
    });

app.use("/user",userRouter);
app.use("/details",detailRouter);
app.use("/friends",friendRouter);
app.use("/chats",chatRouter);

// app.all('*',(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));
// });
app.use(errorMiddleware);

export default app;