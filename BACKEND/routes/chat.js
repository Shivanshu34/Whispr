import express from 'express';
import { loginMiddleware, validateChat, validateMessageUpdate } from '../middleware.js';
import { addChat, seeChat, updateChatMessage, deleteChatMessage } from '../controller/chats.js';
import { wrapAsync } from '../utils/wrapAsync.js'; 

const router = express.Router();

router.post(
            "/:id1/:id2",
            loginMiddleware("You can Chat after a Login"), 
            wrapAsync(addChat)
        );

router.get(
            "/:id1/:id2", 
            loginMiddleware("You are only able to read chat if you are logged in"), 
            wrapAsync(seeChat)
        );

router.put(
           "/:id1/:id2/:chatId", 
           loginMiddleware("You can only able to read messages if you are logged in"), 
           wrapAsync(updateChatMessage)
        );

router.delete(
              "/:id1/:id2/:chatId", 
              loginMiddleware("You can't delete messages until you are logged in"), 
              wrapAsync(deleteChatMessage)
            ); 

export default router;