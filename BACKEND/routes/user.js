import express from "express";
import { customLogin, validateUser } from '../middleware.js';
import { wrapAsync } from "../utils/wrapAsync.js";
import { createUser, updateUser, loginInfo } from "../controller/users.js";
import { loginMiddleware } from "../middleware.js";

const router = express.Router();

router.post("/signUp", validateUser, wrapAsync(createUser));

router.post("/login", wrapAsync(customLogin));

router.post("/logout", (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }

        req.session.destroy(()=>{
            res.clearCookie("connect.sid");
            res.status(200).json({message: "Logout successfull"});
        });
    })
});

router.get(
          "/info/:id1", 
           loginMiddleware("You can get your information after login"), 
           wrapAsync(loginInfo)
        );

router.put("/edit", wrapAsync(updateUser)); 

export default router; 