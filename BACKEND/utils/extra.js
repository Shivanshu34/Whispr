const check = function (currTimeStr, mongoTimeStr) {
    const currDate = new Date(currTimeStr);
    const mongoDate = new Date(mongoTimeStr);
  
    const diffInMs = Math.abs(currDate - mongoDate);
    return diffInMs >= 0 && diffInMs <= 30 * 60 * 1000;
  };

  const contains = (arr, id) => {
    return arr.some(
      el =>
        el?._id?.toString?.() === id.toString() ||
        el?.user?.toString?.() === id.toString()
    );
  };

  const unfriendHelper = (user, friend, id1, id2) => {
    if (!user || !friend) {
      return !user ? "User doesn't exist" : "Friend doesn't exist";
    }
  
    const isFriend = user.Friends.some((el) => el.toString() === id2.toString());
    if (!isFriend) {
      return "They are already not friends";
    }
  
    user.Friends = user.Friends.filter((el) => el.toString() !== id2.toString());
    friend.Friends = friend.Friends.filter((el) => el.toString() !== id1.toString());
  
    return null;
  };
    
  export { check, contains, unfriendHelper };
  