import passport from "passport";
import User from "./models/user.js";
import Detail from "./models/details.js";
import { userSchema, detailsSchema, friendSchema, chatSchema } from "./schema.js";

const customLogin = async(req,res,next) => {

    const {identifier,password} = req.body;
    try{
    let user = await User.findOne({username:identifier});

    if(!user){
        user = await User.findOne({email:identifier});
    }

    if(!user){
        return res.status(401).json({
            message: "Enter a valid username or email",
        });
    }

    //method of passporrt
    user.authenticate(password,(err,authenticatedUser,reason)=>{
        if(err) return next(err);

        if(!authenticatedUser){
            return res.status(401).json({
                message: "Enter a valid password",
            });
        }

        //Login the user :
       req.login(authenticatedUser,async (err)=>{
        if(err) return next(err);

        const safeUser = authenticatedUser.toObject();
        delete safeUser.hash;
        delete safeUser.salt;

        const detail = await Detail.findOne({Owner: safeUser._id});
        const dp = detail?.DP?.url || null;

        return res.status(200).json({
            message: "Login successfully",
            user: safeUser,
            detail: detail,
        });
       });
    });
  }catch(err){
    return next(err);
  }
}

const errorMiddleware = (err,req,res,next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

const loginMiddleware = (message) => {
    return (req, res, next) => {
      const {id1} = req.params;

      if (!req.isAuthenticated()) {
        return res.status(400).json({ message });
      }

      if (req.user._id.toString() !== id1.toString()) {
        return res.status(403).json({
          message: "Forbidden: You can't perform this action",
        });
      }
  
      next();
    };
  };

const validateUser = (req,res,next) => {
  const {error} = userSchema.validate(req.body);
  if(error) {
    let errorMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errorMsg);
  }
  else{
    next();
  }
};

const validateDetails = (req, res, next) => {
  const detailData = {
    Bio: req.body.Bio || "",
    Country: req.body.Country || "",
    Nickname: req.body.Nickname || "",
    Dp: req.file
      ? {
          url: req.file.path,
          public_id: req.file.filename,
        }
      : undefined,
    Owner: req.user?._id?.toString() || "", // or hardcoded for now
  };


  const { error } = detailsSchema.validate(detailData);

  if (error) {
    const errorMsg = error.details.map((el) => el.message).join(", ");
    console.log("Came to validate 2nd",errorMsg);
    return next(new ExpressError(400, errorMsg));
  }

  req.validatedData = detailData; // Optional: pass validated data to next middleware
  next();
};


const validateFriends = (req,res,next) => {
  const {error} = friendSchema.validate(req.body);
  if(error) {
    let errorMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errorMsg);
  }
  else{
    next();
  }
};

const validateChat = (req,res,next) => {
  const {error} = chatSchema.validate(req.body);
  if(error) {
    let errorMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errorMsg);
  }
  else{
    next();
  }
};

const validateMessageUpdate = (req, res, next) => {
  const { error } = updateMessageSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

export {
        customLogin,
        errorMiddleware, 
        loginMiddleware, 
        validateUser, 
        validateDetails, 
        validateFriends, 
        validateChat, 
        validateMessageUpdate 
      };