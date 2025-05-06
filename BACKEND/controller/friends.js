import Friend from "../models/friend.js";
import User from "../models/user.js";
import Detail from "../models/details.js"
import { contains,unfriendHelper } from "../utils/extra.js";

const addRequest = async (req, res, next) => {
  try {
    const { id1, id2 } = req.params;

    if (!id1 || !id2) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user IDs",
      });
    }

    if (id1 === id2) {
      return res.status(403).json({
        status: "fail",
        message: "You cannot send a friend request to yourself",
      });
    }

    let user = await Friend.findOne({ Owner: id1 });
    let friend = await Friend.findOne({ Owner: id2 });

    if (!user) {
      user = new Friend({ Owner: id1 });
    }

    if (!friend) {
      friend = new Friend({ Owner: id2 });
    }

    if (contains(user.Blocked, id2) || contains(friend.BlockedBy, id1)) {
      return res.status(402).json({
        status: "fail",
        message: "Can't send a add request to a block user",
      });
    }


    if (contains(user.Wishlist, id2) || contains(friend.Requests, id1)) {
      return res.status(402).json({
        status: "fail",
        message: "Can't send more than one request to same user",
      });
    }

    user.Wishlist.push(id2);
    friend.Requests.push({ user: id1 });

    await user.save();
    await friend.save();

    return res.status(200).json({
      status: "success",
      message: "Request sent successfully",
      user,
      friend,
    });
  } catch (err) {
    return next(err);
  }
};

const cancelRequest = async (req, res, next) => {
    try {
        const { id1, id2 } = req.params;

        if (!id1 || !id2) {
          return res.status(400).json({
            status: "fail",
            message: "Invalid user IDs",
          });
        }

        if (id1 === id2) {
            return res.status(403).json({
                status: "fail",
                message: "You cannot cancel request to yourself",
            });
        }

        const user = await Friend.findOne({ Owner: id1 });
        const friend = await Friend.findOne({ Owner: id2 });

        if (!user || !friend) {
            return res.status(400).json({
                status: "fail",
                message: "Not a valid user or not a valid friend",
            });
        }

        if (contains(user.Requests, id2) || contains(friend.Wishlist, id1)){
          user.Requests = user.Requests.filter(el => el?.user.toString() !== id2.toString());
          friend.Wishlist = friend.Wishlist.filter(el => el?._id.toString() !== id1.toString());
        }
        else{
          return res.status(400).json({
            status: "fail",
            message: "Can't cancel request if you didn't send one",
          });
        }

        await user.save();
        await friend.save();

        return res.status(200).json({
            status: "success",
            message: "Request cancelled successfully",
            user,
            friend,
        });
    } catch (err) {
        return next(err);
    }
};

const confirmRequest = async (req, res, next) => {
    try {
        const { id1, id2 } = req.params;

        if (!id1 || !id2) {
          return res.status(400).json({
            status: "fail",
            message: "Invalid user IDs",
          });
        }

        if (id1 === id2) {
            return res.status(401).json({
                status: "fail",
                message: "You can't confirm a request to yourself",
            });
        }

        const user = await Friend.findOne({ Owner: id1 });
        const friend = await Friend.findOne({ Owner: id2 });

        if (!user || !friend) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid user or friend",
            });
        }

        if (contains(user.Requests, id2) || contains(friend.Wishlist, id1)){
          user.Requests = user.Requests.filter(el => el?.user.toString() !== id2.toString());
          friend.Wishlist = friend.Wishlist.filter(el => el?._id.toString() !== id1.toString());
        }
        else{
          return res.status(400).json({
            status: "fail",
            message: "Can't cancel request if you didn't send one",
          });
        }
        
        if (contains(user.Friends, id2) || contains(friend.Friends, id1)) {
          return res.status(402).json({
            status: "fail",
            message: "Can't add duplicate friends",
          });
      }

        user.Friends.push(id2);
        friend.Friends.push(id1);
        friend.PopUp.arr.push(id1);

        await user.save();
        await friend.save();

        return res.status(200).json({
            status: "success",
            message: "Friend request accepted successfully",
            user,
            friend,
        });
    } catch (err) {
        return next(err);
    }
};

const destroyPopUp = async(req,res,next) => {
  try {
    const user = await Friend.findOne({ Owner: req.user._id });

    if(user?.PopUp?.arr){
      user.PopUp.arr = [];
    }
    else{
      return res.status(400).json({
        status: "fail",
        message: "Can't delete if a user not added",
      });
    }

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Pop Up cleared Successfully",
    });

  } catch (err) {
    return next(err);
  }
}

const searchFriend = async (req, res, next) => {
    try {
        const username = decodeURIComponent(req.params.username || '').trim();

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(400).json({
                message: "Friend not found",
            });
        }

        let Owner = req.user?._id || null;
        const detail = await Detail.findOne({ Owner: user?._id}) || null;
        const realUserFriend = Owner ? await Friend.findOne({ Owner: req.user._id }) : null;
        const realUser = await User.findById(req.user?._id) || null;
        
        if(realUser && realUser.username === username){
          return res.status(400).json({
            message: "Can't search yourself",
          });
        }

        const sendDetails = {
            id: user._id,
            username: user.username,
            DP: detail?.DP,
            Bio: detail?.Bio,
            nickname: detail?.nickname
        };

        let status = "Add";
        let status2 = "Block";

        if (realUserFriend && contains(realUserFriend.Friends, user._id)) {
          status = "Friend";
        } else if (realUserFriend && contains(realUserFriend.Wishlist, user._id)) {
          status = "Sent";
        } else if (realUserFriend && contains(realUserFriend.Requests, user._id)) {
          status = "Received";
        } else if (realUserFriend && contains(realUserFriend.Blocked, user._id)) {
          status2 = "Blocked";
        }

        return res.status(200).json({
            message: "User found successfully",
            status,
            status2,
            sendDetails,
        });
    } catch (err) {
        return next(err);
    } 
};

const unfriend = async (req, res, next) => {
  try {
    const { id1, id2 } = req.params;

    if (!id1 || !id2) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user IDs",
      });
    }

    const user = await Friend.findOne({ Owner: id1 });
    const friend = await Friend.findOne({ Owner: id2 });

    const message = unfriendHelper(user, friend, id1, id2);

    if (message) {
      return res.status(400).json({
        status: "fail",
        message
        });
    }

    await user.save();
    await friend.save();

    return res.status(200).json({
      status: "success",
      message: "Friend removed successfully",
      user,
      friend,
    });
  } catch (err) {
    return next(err);
  }
};

const blockFriend = async (req, res, next) => {
  try {
    const { id1, id2 } = req.params;

    if (!id1 || !id2) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user IDs",
      });
    }

    let user = await Friend.findOne({ Owner: id1 });
    let friend = await Friend.findOne({ Owner: id2 });

    if (!user) {
      user = new Friend({ Owner: id1 });
    }

    if (!friend) {
      friend = new Friend({ Owner: id2 });
    }

    if (!user || !friend) {
      return res.status(400).json({ 
        status: "fail",
        message: "User or friend not found", 
      });
    }

    let isFriend = contains(user.Friends, id2) || contains(friend.Friends, id1)
    
    unfriendHelper(user, friend, id1, id2);

    if (user.Blocked.includes(id2) || friend.BlockedBy.includes(id1)) {
      return res.status(400).json({
        status: "fail",
        message: "You can't double block a same person",
      });
    }

    user.Blocked.push(id2);
    friend.BlockedBy.push(id1);

    if(isFriend && friend?.PopUp?.arr){
      friend.PopUp.arr = friend.PopUp.arr.filter(el => el.toString() !== id1.toString());
    }

    await user.save();
    await friend.save();

    return res.status(200).json({
      status: "success",
      message: "User blocked successfully",
      user,
    });
  } catch (err) {
    return next(err);
  }
};

const unblockFriend = async (req, res, next) => {
  try {
    const { id1, id2 } = req.params;

    if (!id1 || !id2) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user IDs",
      });
    }

    const user = await Friend.findOne({ Owner: id1 });
    const friend = await Friend.findOne({ Owner: id2 });

    if (!user || !friend) {
      return res.status(400).json({
        status: "fail",
        message: "User or friend not found",
      });
    }

    if (!user.Blocked.includes(id2) || !friend.BlockedBy.includes(id1)) {
      return res.status(400).json({
        status: "fail",
        message: "You can't double unblock the same person",
      });
    }

    user.Blocked = user.Blocked.filter((el) => el.toString() !== id2.toString());
    friend.BlockedBy = friend.BlockedBy.filter((el) => el.toString() !== id1.toString());
    
    await user.save();
    await friend.save();

    return res.status(200).json({
      status: "success",
      message: "Unblocked successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const withdrawRequest = async (req, res, next) => {
  try {
    const { id1, id2 } = req.params;

    if (!id1 || !id2) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user IDs",
      });
    }

    const user = await Friend.findOne({ Owner: id1 });
    const friend = await Friend.findOne({ Owner: id2 });

    if (!user || !friend) {
      return res.status(400).json({
        status: "fail",
        message: "User or friend not found",
      });
    }

    const isInWishlist = user.Wishlist.includes(id2);
    const isInRequests = friend.Requests.some(el => el.user.toString() === id1.toString());

    if (!isInWishlist || !isInRequests) {
      return res.status(400).json({
        status: "fail",
        message: "Can't withdraw a request if you didn't send one",
      });
    }

    user.Wishlist = user.Wishlist.filter(el => el.toString() !== id2.toString());
    friend.Requests = friend.Requests.filter(el => el.user.toString() !== id1.toString());

    await user.save();
    await friend.save();

    return res.status(200).json({
      status: "success",
      message: "Withdrawn request successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const seeFriendSection = (sectionName) => {
  return async (req, res, next) => {
    try {
      const { id1 } = req.params;
      const realUser = await User.findById(id1); 
      const user = await Friend.findOne({ Owner: id1 });

      if (!realUser) {
        return res.status(400).json({
          message: "User not found",
          status: "fail",
        });
      }
      
      if (!user) {
        return res.status(200).json({
          message: "No friends to show",
          status: "Success",
          [sectionName]: [],
        });
      }      

      const section = user[sectionName];

      const sendDetails = await Promise.all(
        section.map(async function (el) {
          let detail;
          let user2;
          let date;
    
          if(sectionName === "Requests"){
            detail = await Detail.findOne({ Owner: el.user });
            user2 = await User.findById(el.user);
            let requestedAt = el.requestedAt;
            let newDate = new Date(requestedAt);
            let formattedDate = newDate.toLocaleDateString('en-US');
            date = formattedDate || "N/A";
          }
          else{
            detail = await Detail.findOne({ Owner: el });
            user2 = await User.findById(el);
          }
      
          return {
            id: user2?._id,
            username: user2?.username,
            DP: detail?.DP?.url || "https://res.cloudinary.com/dxhyznlyz/image/upload/v1746439138/default-avatar_xfrwa6.jpg",
            Bio: detail?.Bio || "No Bio to show",
            nickname: detail?.nickname || "No nickname to show",
            requestedAt: date || null,
          };
        })
      );
      
      return res.status(200).json({
        message: `Successfully fetched your ${sectionName.toLowerCase()}`,
        status: "success",
        [sectionName]: section,
        sendDetails: sendDetails,
      });

    } catch (err) {
      return next(err);
    }
  };
};

export { 
  addRequest, 
  cancelRequest, 
  confirmRequest, 
  searchFriend, 
  destroyPopUp, 
  unfriend, 
  blockFriend, 
  unblockFriend, 
  withdrawRequest,
  seeFriendSection
 }; 