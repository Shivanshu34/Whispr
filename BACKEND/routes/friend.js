import express from 'express'; 
import { wrapAsync } from '../utils/wrapAsync.js';
import { loginMiddleware } from '../middleware.js';
import { 
    addRequest,
    cancelRequest,
    confirmRequest, 
    searchFriend, 
    destroyPopUp, 
    unfriend, 
    blockFriend, 
    unblockFriend, 
    withdrawRequest ,
    seeFriendSection
} from '../controller/friends.js';

const router = express.Router(); 

router.post(
        '/add/:id1/:id2', 
        loginMiddleware("Adding friends possible after login"), 
        wrapAsync(addRequest)
        );

router.post(
        '/cancel/:id1/:id2', 
        loginMiddleware("Cancelling requests possible after login"), 
        wrapAsync(cancelRequest)
        );

router.post(
        '/confirm/:id1/:id2', 
        loginMiddleware("Confirming friends possible after login"), 
        wrapAsync(confirmRequest)
        );

router.post(
        '/destroyPopUp/:id1', 
        loginMiddleware("Deleteing friends possible after login"), 
        wrapAsync(destroyPopUp)
        );

router.get('/search/:username', wrapAsync(searchFriend));  

router.post(
        '/block/:id1/:id2', 
        loginMiddleware("Blocking possible after login"), 
        wrapAsync(blockFriend)
        );

router.put(
        '/unfriend/:id1/:id2', 
        loginMiddleware("Unfiriend possible after login"), 
        wrapAsync(unfriend)
        );

router.put(
        '/unblock/:id1/:id2', 
        loginMiddleware("Unblocking possible after login"), 
        wrapAsync(unblockFriend)
        );

router.put(
        '/withdraw/:id1/:id2', 
        loginMiddleware("Withdrawing possible after login"), 
        wrapAsync(withdrawRequest)
        );

router.get(
        '/requests/:id1', 
        loginMiddleware("Seeing Requests possible after login"), 
        wrapAsync(seeFriendSection("Requests"))
        );

router.get(
        '/wishlist/:id1', 
        loginMiddleware("Seeing Wishlist possible after login"), 
        wrapAsync(seeFriendSection("Wishlist"))
        );

router.get(
        '/friends/:id1', 
        loginMiddleware("Seeing Friends possible after login"), 
        wrapAsync(seeFriendSection("Friends"))
        );

router.get(
        '/blockedfriends/:id1', 
        loginMiddleware("Seeing Friends possible after login"), 
        wrapAsync(seeFriendSection("Blocked"))
        );

export default router;