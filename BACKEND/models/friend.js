import mongoose from "mongoose";

const {Schema} = mongoose;

const friendSchema = new Schema({
    Friends: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],

    Blocked: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],

    BlockedBy: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],

    Wishlist: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],

    Requests: [{
        user: { type: Schema.Types.ObjectId, ref: "User" },
        requestedAt: { type: Date, default: Date.now }
    }],

    PopUp: {
      arr: [{
        type: Schema.Types.ObjectId,
        ref: "User",
      }],
    },

    Owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }

}, {timestamps: true});

friendSchema
  .path("Friends")
  .validate(function(friends){
    return friends.length <= 10;
  }, "You can have a maximum of 10 friends only");

friendSchema
  .path("Wishlist")
  .validate(function(wishlist){
    return wishlist.length <= 100;
  }, "You can send maximum of 100 requests");

friendSchema.index({Owner: 1});

const Friend = mongoose.model("Friend",friendSchema);

export default Friend;