import User from "../models/user.js";
import Detail from "../models/details.js";

export const createUser = async(req,res,next) => {
   try
   { 
    const user = new User({
        username: req.body.username,
        email: req.body.email,
    });

    await User.register(user,req.body.password);

    req.login(user, (err) => {
      if (err) return next(err);

      const safeUser = user.toObject();
      delete safeUser.hash;
      delete safeUser.salt;

      res.status(200).json({
        message: `${user?.username || 'User'} enters successfully`,
        status: "success",
        user: safeUser,
      });
    });
   }
   catch(err){
    return next(err);
   }
}

export const updateUser = async (req, res, next) => {
    try {
     if (!req.isAuthenticated()) {
      return res.status(401).json({ status: "fail", message: "Unauthorized access" });
     }
    
     const { id, newUsername } = req.body;

     if (req.user._id.toString() !== id) {
        return res.status(403).json({ status: "fail", message: "Forbidden: You can't edit someone else's account" });
      }

      let user = await User.findByIdAndUpdate(
        id,
        { username: newUsername },
        { runValidators: true, new: true }
      );
  
      req.login(user,(err)=>{
        if(err){
          return next(err);
        }

      const safeUser = user.toObject();
      delete safeUser.hash;
      delete safeUser.salt;
  
      res.status(200).json({
        message: `Updation successful, Welcome ${newUsername || "User"}`,
        status: "success",
        user: safeUser,
      });
    });

    } catch (err) {
      return next(err);
    }
  };
  
  export const loginInfo = async (req, res, next) => {
    try {
      const { id1 } = req.params;
  
      const user = await User.findById(id1);
      const detail = await Detail.findOne({ Owner: id1 });
  
      if (!user) {
        return res.status(400).json({
          message: "Can't find a user",
          status: "fail",
        });
      }
  
      const safeUser = {
        user: user.toObject(),
      };
  
      if (detail) {
        safeUser.detail = detail;
      }
  
      delete safeUser.user.hash;
      delete safeUser.user.salt;
  
      res.status(200).json({
        message: 'Retrieval of information was successful',
        status: "success",
        user: safeUser,
      });
  
    } catch (err) {
      return next(err);
    }
  };
  