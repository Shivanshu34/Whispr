import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, CardHeader, Avatar, Typography, CardActions, CardMedia
} from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import toast from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { seeFriends } from '../views/JS/Extra';

import { useUser } from '../Context/UserContext';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "rgba(39, 48, 67, 0.45)",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
}));

const Friends = () => {
  const navigate = useNavigate();

  const { user } = useUser();

  const userDetails = user?.userDetails;

 // console.log(userDetails);

 useEffect(()=>{
    const dataErr = {
       errMsg: "Can,t access Friends page without login/signUp",
       path1: "/signup",
       path2: "/signin",
    }
    if(!userDetails){
       navigate("/failure", {state : dataErr });
    }
},[user]);

  const [data, setData] = useState({});
  const [hasFriends, setHasFriends] = useState(false);
  const [details, setDetails] = useState({});
  const [red, setRed] = useState(false);

useEffect(()=>{
  let path;
  if(userDetails?._id){
  path = `http://localhost:4000/friends/friends/${userDetails._id}`;}
  if (userDetails?._id) seeFriends(path, setData, setDetails, setHasFriends);
  }, [userDetails]);

  const handleBig = (index) => {
      if(details.username !== data?.sendDetails[index].username){
      setDetails(data?.sendDetails[index]);
      setRed(!red);
      }
  }

  const handleUnfriend = async(id) => {
      try {
          const res = await axios.put(
            `http://localhost:4000/friends/unfriend/${userDetails._id}/${id}`,
            {},
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
    
        if(res.data.status === "success"){
          setHasFriends(false);
          const path = `http://localhost:4000/friends/friends/${userDetails._id}`;
          if (userDetails?._id) seeFriends(path, setData, setDetails, setHasFriends);
          toast.success(`Request unsended successfully`);
        }
        } catch (error) {
          toast.error(error.response?.data?.message || 'An error occurred');
        }
  }

    const turnRed = () =>{
        setRed(!red);
    }
    
    let style = red ?  {color: "red"} : {color: "none"};

  return (
    <Box sx={{ flexGrow: 1, mt: "0.2rem"}}>
    {hasFriends && <Grid container spacing="6rem">
      <Grid size={5}>
        <Stack spacing={2}>
        {data.sendDetails.map((data, index) => {
        return (
        <Item key={index} onClick={()=>handleBig(index)}>
           <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar alt={data.username} src={data.DP} sx={{ ml: 1 }} />
              <Typography sx={{ ml: 3, color: "whitesmoke" }}>{data.username}</Typography>
           </Box>
        </Item>
        );
    })}
        </Stack>
      </Grid>
      <Grid size={5}>
        <Item sx={{ height: '30rem', boxSizing: 'border-box' }}>
        <Card sx={{ maxWidth: 325, display: "block",  backgroundColor: "rgba(0,0,0,0)", color: "whitesmoke" }}>
        <CardHeader
        avatar={
          <Avatar alt="User" src={details.DP} />
        }
        action={
          <IconButton aria-label="settings" sx={{color:"white"}}>
            <MoreVertIcon />
          </IconButton>
        }
         title={<Typography variant="h5">{details.username}</Typography>} 
      />
      <CardMedia
        component="img"
        height="234"
        image={details.DP}
        alt="Profile Pic"
      />
      <CardContent>
       {details.Bio} <br/>
       {details.nickname} <br/>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" sx={{color:"white"}}>
          <FavoriteIcon onClick={turnRed} sx={style}/>
        </IconButton>
        <IconButton aria-label="share" sx={{color:"white"}}>
          <ShareIcon />
        </IconButton> 
        <Button
          size="md"
          variant="contained"
          sx={{ color: "white", ml: "7.5rem", backgroundColor: "rgba(25, 118, 210, 1)" }}
          onClick={() => handleUnfriend(details.id)}
        >
          Unfriend
      </Button> 
      </CardActions>
    </Card>
        </Item>
      </Grid>
    </Grid>}

    {!hasFriends && 
    <Typography variant="h3" sx={{color: 'whitesmoke', ml: '13rem', mt: '6rem'}}>
        No Friends to show
    </Typography>}
  </Box>
  );
};

export default Friends;
