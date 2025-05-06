import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../Context/UserContext';

function Logout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser } = useUser();

  const from = location.state?.from || null;
  const id = location.state?.userDetails?._id;

  let username2 = location.state?.userDetails?.username;

  useEffect(()=>{
    const dataErr = {
      errMsg: "Can't access Logout page directly or without login",
    }
    if(!from || !id){
      navigate("/failure", {state : dataErr });
    }
  },[]);

  let response;
 //console.log("Entered");

 useEffect(() => {
    const logoutHandler = async () => {
      try {
        const response = await axios.post(
          'http://localhost:4000/user/logout',
          {},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(response?.data?.message);
  
        const dataToSend = {
          from: location.pathname,
          user: username2,
          msg: `${username2} logout successfully`,
        };

        setUser(null);
        navigate('/success', { state: dataToSend });
      } catch (error) {
        toast.error(error?.response?.data?.message || 'An error occurred');
      }
    };
  
    logoutHandler();
  }, []);
  

  return (<></>);
  };
  
  export default Logout;