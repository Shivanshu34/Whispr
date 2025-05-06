import Detail from "../models/details.js";
import User from "../models/user.js";
import { cloudinary } from "../cloudconfig.js";

const addDetails = async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(400).json({ message: "Unauthorized access" });
      }
  
      const { Bio, Country, Nickname } = req.body;
  
      const user = await Detail.findOne({ Owner: req.user._id });
  
      if (user) {
        return res.status(401).json({
          message: "For updation use Put request instead of Post",
          status: "fail",
        });
      }
  
      const detailData = {
        Bio,
        Country,
        Nickname,
        Owner: req.user._id,
      };
  
      if (req.file) {
        detailData.DP = {
          url: req.file.path,
          public_id: req.file.filename,
        };
      }
  
      const detail = new Detail(detailData);
      await detail.save();
  
      res.status(200).json({
        message: "Details added successfully",
        status: "success",
        detail,
      });
  
    } catch (err) {
      console.error("AddDetails Error:", err); // Important
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  };
  

const editDetails = async (req, res, next) => {
    try {
        const detail = await Detail.findOne({ Owner: req.user._id });
        const user = await User.findById(req.user._id);

        if (!detail) {
            return res.status(401).json({
                message: "For first time adding data use POST request",
                status: "fail",
            });
        }

        const { Bio, Country, Nickname } = req.body;

        if((detail.Bio === Bio &&
           detail.Country === Country &&
           detail.Nickname === Nickname &&
           !req.file) ||
           (!Bio && !Country && !Nickname && !req.file)){
            return res.status(400).json({
                message: "Don't call if you don't want to edit your info",
                status: "fail",
            });
        }


        const detailData = {
            Bio,
            Country,
            Nickname,
        };

        if (req.file) {
            if (detail.DP?.public_id !== req.file.filename) {
                await cloudinary.uploader.destroy(detail.DP.public_id);
            }   

            detailData.DP = {
                url: req.file.path,
                public_id: req.file.filename,
            };     
        }

        const updatedDetail = await Detail.findByIdAndUpdate(
            detail._id,
            { ...detailData },
            { runValidators: true, new: true }
        );


        req.login(user,(err)=>{
          if(err){
            return next(err);
          }

        return res.status(200).json({
            message: "Data updated successfully",
            status: "success",
            updatedDetail,
        });
      });
    } catch (err) {
        return next(err);
    }
};

export { addDetails, editDetails }; 
