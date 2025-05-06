import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Avatar, Typography, CardActions, CardMedia
} from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import toast from 'react-hot-toast';
import { useUser } from '../Context/UserContext';

const SearchPage = () => {
  const navigate = useNavigate();

  const { user } = useUser();

  const userDetails = user?.userDetails;

//  useEffect(()=>{
//     const dataErr = {
//        errMsg: "Can,t access Search page directly",
//     }
//     if(user && !user.from){
//        navigate("/failure", {state : dataErr });
//     }
// },[user]);

  const [query, setQuery] = useState(' ');
  const [search, setSearch] = useState(false);
  const [search2, setSearch2] = useState(false);
  const [dp, setDp] = useState('');
  const [bio, setBio] = useState('');
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');
  const [notFound, setNotFound] = useState('');
  const [status, setStatus] = useState('');
  const [color, setColor] = useState('');
  // const [isDisabled, setIsDisabled] = useState(false);
  const [status2, setStatus2] = useState('');
  const [isDisabledBlock, setIsDisabledBlock] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(
        `http://localhost:4000/friends/search/${query}`,
        {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
    );

      setDp(() => res.data?.sendDetails?.DP?.url || "https://res.cloudinary.com/dxhyznlyz/image/upload/v1746439138/default-avatar_xfrwa6.jpg");
      setBio(() => res.data?.sendDetails?.Bio || '');
      setUsername(() => res.data?.sendDetails?.username || '');
      setNickname(() => res.data?.sendDetails?.nickname || '');
      setId(() => res.data?.sendDetails?.id || '');  
      setStatus(() => res.data?.status); 
      setStatus2(() => res.data?.status2);   
      if(res.data) {
        setSearch(true);
        setSearch2(false);
      }
    } catch (error) {
      setNotFound(error.response?.data?.message);
      setSearch(false);
      setSearch2(true);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleAdd = async (status) => {
    if(!userDetails){
      toast.error("You can add friends after login");
      return;
    }
    console.log(status);
    if(status != "Add") return;
    try {
      const res = await axios.post(
        `http://localhost:4000/friends/add/${userDetails._id}/${id}`,
        {},
        {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        }
    );

    if(res.data){
      setStatus('Sent');
      toast.success('Request Sent successfully');
    }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }

  const handleBlock = async () => {
    if(!userDetails){
      toast.error("You can block friends after login");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to block the user?");
    if (!confirmed) return;
    try {
      const res = await axios.post(
        `http://localhost:4000/friends/block/${userDetails._id}/${id}`,
        {},
        {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        }
    );
    
    if(res.data){
      setStatus2('Blocked');
      toast.success('Blocked successfully');
    }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }

  useEffect(() => {
    const color2 = status === "Friend" ? "success"
      : status === "Sent" ? "grey"
      : status === "Received" ? "primary"
      : "secondary";
  
    // const isDisabled2 = status !== "Add";
  
    setColor(color2);
    // setIsDisabled(isDisabled2);

    const isDisabled3 = status2 !== "Block";
    setIsDisabledBlock(isDisabled3);
  }, [status,status2]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', color: 'white', width: '50rem', backgroundColor: "rgba(39, 48, 67, 0.55)", }}
    >
      <IconButton sx={{ p: '10px', color: 'white' }} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, color: 'white' }}
        placeholder="Search User by Username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="button" sx={{ p: '10px', color: 'white' }} aria-label="search" onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px', color: 'white' }} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
    </Paper>
      </Box>

     {search &&  <Card sx={{ maxWidth: 335, ml: '14rem' }}>
      <CardMedia
        sx={{ height: 245 }}
        image={dp}
        title={username}
      />
      <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Avatar alt="User" src={dp} />
        <Typography variant="h5">{username}</Typography>
      </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {bio}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {nickname}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" 
        // disabled={isDisabled} 
        color={color} 
        // sx={{
        //   color: isDisabled ? `${color}.main` : undefined,
        // }}
        onClick={()=>handleAdd(status)}>
          {status}
        </Button>
        <Button size="small"
         disabled={isDisabledBlock} 
         onClick={handleBlock}
         >
          {status2}
        </Button>
      </CardActions>
    </Card>
    }

    {search2 && <Typography variant="h3" sx={{color: 'whitesmoke', ml: '13rem', mt: '6rem'}}>{notFound}</Typography>}
    </Box>
  );
};

export default SearchPage;
