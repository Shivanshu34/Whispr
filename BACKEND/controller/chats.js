import Chat from "../models/chat.js";
import { check } from "../utils/extra.js";
import mongoose from "mongoose"; 

const addChat = async (req, res, next) => {
    try {
      const { id1, id2 } = req.params;
      const { message } = req.body;

      const ID1 = new mongoose.Types.ObjectId(id1);
      const ID2 = new mongoose.Types.ObjectId(id2);

      let chat1 = await Chat.findOne({ Owner: ID1, chatWith: ID2 });
      let chat2 = await Chat.findOne({ Owner: ID2, chatWith: ID1 });
  
      if (!chat1) {
        chat1 = new Chat({ Owner: ID1, chatWith: ID2, messages: [] });
      }
      
      if (!chat2) {
        chat2 = new Chat({ Owner: ID2, chatWith: ID1, messages: [] });
      }
  
      const msg = message?.toString().trim();
      if (!msg) {
        return res.status(400).json({ message: "Can't send empty message", status: "fail" });
      }
  
      const messageObj = {
        sender: ID1,
        isRead: true,
        content: msg,
      };

      chat1.messages.push(messageObj);
      await chat1.save();
      const { _id: chatId } = chat1.messages.at(-1); 

      const messageObjForFriend = {
        sender: ID1,
        isRead: false,
        content: msg,
        _id: chatId,
      };
  
      chat2.messages.push(messageObjForFriend);
  
      await chat2.save();
  
      return res.status(200).json({
        message: "Message delivered",
        status: "success",
        chat1,
        chat2,
      });
  
    } catch (err) {
      return next(err);
    }
  };
  
  const seeChat = async (req, res, next) => {
    try {
      const { id1, id2 } = req.params;
  
      let chat = await Chat.findOne({ Owner: id1, chatWith: id2 });

     if(chat) 
      for (let i = chat.messages.length - 1; i >= 0; i--) {
        if (!chat.messages[i].isRead) {
          chat.messages[i].isRead = true;
        } else {
          break;
        }
      }
  
      let message;
  
      if (!chat) {
        message = "Chat is empty, want to start one?";
      } else if (chat.messages?.length === 0) {
        message = "Chat is created but conversation is not started.";
      } else {
        message = "Chat retrieved successfully.";
      }
  
      return res.status(200).json({
        status: "success",
        message: message,
        chat: chat ? chat : null,
      });
  
    } catch (err) {
      return next(err);
    }
  };  
   
  const updateChatMessage = async (req, res, next) => {
    try {
      const { id1, id2, chatId } = req.params;
      const { message } = req.body;
  
      const chat1 = await Chat.findOne({ Owner: id1, chatWith: id2 });
      const chat2 = await Chat.findOne({ Owner: id2, chatWith: id1 });
  
      if (!chat1 || !chat2 || chat1.messages?.length === 0 || chat2.messages?.length === 0) {
        return res.status(400).json({ message: "Chat can't be edited before created" });
      }
  
      const msg1 = chat1.messages.find(el => el._id.toString() === chatId.toString());
      const msg2 = chat2.messages.find(el => el._id.toString() === chatId.toString());
  
      if (!msg1 || !msg2) {
        return res.status(400).json({ error: "Message not found" });
      }

      if(msg1.sender.toString() !== req.user._id.toString() || id1.toString() !== msg1.sender.toString()){
        return res.status(400).json({ message: "Only a owner of a chat can edit a message"});
      }

      const currTime = new Date().toISOString();
      const mongoTime = new Date(msg1.timestamp).toISOString();
  
      if (!check(currTime, mongoTime)) {
        return res.status(400).json({ message: "Can't be updated", status: "fail" });
      }
  
      if (!message?.trim()) {
        return res.status(400).json({ error: "Message cannot be empty" });
      }
  
      msg1.content = message;
      msg2.content = message;
  
      await chat1.save();
      await chat2.save();
  
      return res.status(200).json({ message: "Updated", status: "success" });
  
    } catch (err) {
      return next(err);
    }
  };

  const deleteChatMessage = async (req, res, next) => {
    try {
      const { id1, id2, chatId } = req.params;
  
      const chat1 = await Chat.findOne({ Owner: id1, chatWith: id2 });
      const chat2 = await Chat.findOne({ Owner: id2, chatWith: id1 });
  
      if (!chat1 || !chat2 || chat1.messages?.length === 0 || chat2.messages?.length === 0) {
        return res.status(400).json({ message: "Chat can't be deleted before created" });
      }
  
      const msg1 = chat1.messages.find(el => el._id.toString() === chatId);
      const msg2 = chat2.messages.find(el => el._id.toString() === chatId);
  
      if (!msg1 || !msg2) {
        return res.status(400).json({ error: "Message not found" });
      }

      if(msg1.sender.toString() !== req.user._id.toString() || id1.toString() !== msg1.sender.toString()){
        return res.status(400).json({ message: "Only a owner of a chat can delete a message"});
      }
  
      const currTime = new Date().toISOString();
      const mongoTime = new Date(msg1.timestamp).toISOString();
  
      if (!check(currTime, mongoTime)) {
        return res.status(400).json({ message: "Can't be deleted", status: "fail" });
      }
  
      chat1.messages = chat1.messages.filter(el => el._id.toString() !== chatId);
      chat2.messages = chat2.messages.filter(el => el._id.toString() !== chatId);
  
      await chat1.save();
      await chat2.save();
  
      return res.status(200).json({ message: "Deleted", status: "success" });
  
    } catch (err) {
      return next(err);
    }
  }; 
  
  
export { addChat, seeChat, updateChatMessage, deleteChatMessage };
  