import mongoose from "mongoose";

const {Schema} = mongoose;

const detailsSchema = new Schema({
    Bio: {
      type: String,
      trim: true,
      default: "",
    },
    Country: {
      type: String,
      trim: true,
      default: "",
    },
    Nickname: {
      type: String,
      trim: true,
      maxLength: 20,
      default: "",
    },
    DP: {
      url:{
        type: String,
        default: "https://res.cloudinary.com/dxhyznlyz/image/upload/v1746439138/default-avatar_xfrwa6.jpg", 
      },
      public_id:{
        type: String,
        default: "default-avatar_xfrwa6",
      }, 
    },

    Owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
});

const Detail = mongoose.model("Detail", detailsSchema);

export default Detail; 