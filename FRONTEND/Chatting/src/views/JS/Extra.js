import toast from 'react-hot-toast';
import axios from 'axios';

export const seeFriends = async (path, setData, setDetails, setHasFriends) => {
    try {
        const res = await axios.get(
            `${path}`,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
        );
        
       // console.log(res.data);
        res?.data && setData(() => res?.data);
        res?.data?.sendDetails.length > 0 && setHasFriends(() => true);
        res?.data?.sendDetails.length > 0 && setDetails(() => res?.data?.sendDetails[0]);

     } catch (error) {
         toast.error(error.response?.data?.message || 'An error occurred');
     }
}

export const seeChats = async (path, setChats, setHasChat) => {
    try {
        const res = await axios.get(
            `${path}`,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
        );
        
        console.log(res.data);
        res?.data && setChats(res?.data);
        res?.data?.chat?.messages?.length > 0 && setHasChat(true);
        res?.data?.chat?.messages?.length <= 0 && setHasChat(false);

     } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
     }
}

export const editChat = async (path, message) => {
    try {
        const res = await axios.put(
            `${path}`,
            {
                message: message,
            },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
        );
        
        console.log(res.data);
        toast.success("Message updated successfully");

     } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
     }
}

export const deleteChat = async (path) => {
    try {
        const res = await axios.delete(
            `${path}`,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
        );
        
        console.log(res.data);

     } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
     }
}