import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  isRead: {
    type: Boolean,
    default: false,
  }, 

  timestamp: {
    type: Date,
    default: Date.now,
  },

});

const chatSchema = new Schema({
  Owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  chatWith: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  messages: [messageSchema],

}, { timestamps: true });

chatSchema.index({ Owner: 1, chatWith: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
