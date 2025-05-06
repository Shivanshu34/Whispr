import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, CardHeader, Avatar, Typography, Menu, MenuItem
} from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import toast from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { seeFriends } from '../views/JS/Extra';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import { seeChats, editChat, deleteChat } from '../views/JS/Extra';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useUser } from '../Context/UserContext';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(39, 48, 67, 0.44)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const Chats = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(' ');
  const { user } = useUser();
  const userDetails = user?.userDetails;
  const dp = user?.dp || "https://res.cloudinary.com/dxhyznlyz/image/upload/v1746439138/default-avatar_xfrwa6.jpg";

  useEffect(() => {
    const dataErr = {
      errMsg: "Can,t access Chat page without login/signUp",
      path1: "/signup",
      path2: "/signin",
    }
    if (!userDetails) {
      navigate("/failure", { state: dataErr });
    }
  }, [user]);

  const [data, setData] = useState({});
  const [hasFriends, setHasFriends] = useState(false);
  const [details, setDetails] = useState({});
  const [chat, setChat] = useState({});
  const [hasChat, setHasChat] = useState(false);
  const [anchorElMsg, setAnchorElMsg] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState('');
  const [selectedMsgId, setSelectedMsgId] = useState('');
  const [selectedMsgContent, setSelectedMsgContent] = useState('');


  const handleOpenMsgMenu = (event, msgId, msgContent) => {
    setAnchorElMsg(event.currentTarget);
    setSelectedMsgId(msgId);
    setSelectedMsgContent(msgContent);
  };  

  const handleCloseMsgMenu = () => {
    setAnchorElMsg(null);
  };

  const handleNavClick = async (action) => { 
    handleCloseMsgMenu();
    document.activeElement.blur();
  
    const path2 = `http://localhost:4000/chats/${userDetails._id}/${details.id}/${selectedMsgId}`;
    const path3 = `http://localhost:4000/chats/${userDetails._id}/${details.id}`;
  
    if (action === 'Delete') {
      try {
        await deleteChat(path2);
        setHasChat(false);
        await seeChats(path3, setChat, setHasChat);
      } catch (err) {
        toast.error("Error deleting chat");
      }
    }
  
    if (action === 'Edit') {
      setQuery(selectedMsgContent);
      setIsEdit(true);
      setId(selectedMsgId);
    }
  };  
  
  const settings = ['Edit', 'Delete'];

  useEffect(() => {
    if (details?.id && userDetails?._id) {
      const path2 = `http://localhost:4000/chats/${userDetails._id}/${details.id}`;
      setHasChat(false);
      seeChats(path2, setChat, setHasChat);
    }
  }, [details]);

  useEffect(() => {
    let path;
    if(userDetails?._id){
    path = `http://localhost:4000/friends/friends/${userDetails._id}`;}
    if (userDetails?._id) seeFriends(path, setData, setDetails, setHasFriends);
  }, [userDetails]);

  const handleBig = (index) => {
    console.log(details.username);
    if (details.username !== data?.sendDetails[index].username) {
      setDetails(() => data?.sendDetails[index]);
    }
  }

  const handleMessage = async () => {
    setQuery('');
    if (!query.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if(!isEdit)
    try {
      const res = await axios.post(
        `http://localhost:4000/chats/${userDetails._id}/${details.id}`,
        { message: query },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.status === "success") {
        // setHasChat(false);
        const path2 = `http://localhost:4000/chats/${userDetails._id}/${details.id}`;
        if (userDetails?._id) seeChats(path2, setChat, setHasChat);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
    if(isEdit){
      setIsEdit(false);
      const path2 = `http://localhost:4000/chats/${userDetails._id}/${details.id}/${id}`;
      const path3 = `http://localhost:4000/chats/${userDetails._id}/${details.id}`;
      setId('');

      await editChat(path2, query); 
      setHasChat(false);
      await seeChats(path3, setChat, setHasChat);
    }
  }

  return (
    <Box sx={{ flexGrow: 1, mt: "0rem"}}>
      {hasFriends && (
        <Grid container spacing="0.5rem">
          <Grid size={3.5}>
            <Stack spacing={2}>
              {data.sendDetails.map((data, index) => {
                return (
                  <Item key={index} onClick={() => handleBig(index)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', boxShadow: '0 4px 4px rgba(39, 48, 67, 0.3)', }}>
                      <Avatar alt={data.username} src={data.DP} sx={{ ml: 1 }} />
                      <Typography sx={{ ml: 3, color: "whitesmoke" }}>{data.username}</Typography>
                    </Box>
                  </Item>
                );
              })}
            </Stack>
          </Grid>

          <Grid size={8.5} sx={{ backgroundImage: 'url(background_home_2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Item sx={{ height: '30.88rem', boxSizing: 'border-box' }}>
              <Card
                sx={{
                  maxWidth: 835,
                  height: '30.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(0,0,0,0)',
                  color: 'whitesmoke',
                }}
              >
                <CardHeader
                  avatar={<Avatar alt="User" src={details.DP} />}
                  action={
                    <IconButton aria-label="settings" sx={{ color: 'white' }}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={<Typography variant="h6">{details.username}</Typography>}
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  }}
                />

                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  <CardContent>
                    {hasChat && (
                      <Box sx={{ width: '100%' }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                          {chat?.chat?.messages?.map((data, index) => (
                            <React.Fragment key={chat?.chat?.messages?.[index]._id}>
                              <Grid size={6}>
                                {chat?.chat.Owner === data.sender && (
                                  <Box sx={{ display: 'flex' }}>
                                    <IconButton
                                      sx={{ ml: '-1rem', p: 0, color: "white" }}
                                      onClick={(e) => handleOpenMsgMenu(e, chat?.chat?.messages?.[index]._id, chat?.chat?.messages?.[index].content)}
                                    >
                                      <KeyboardArrowDownIcon />
                                    </IconButton>

                                    <Menu
                                      anchorEl={anchorElMsg}
                                      open={Boolean(anchorElMsg)}
                                      onClose={handleCloseMsgMenu}
                                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                      {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={() => handleNavClick(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                       </MenuItem>
                                      ))}
                                    </Menu>

                                    <Item sx={{ display: 'flex', color: "white", boxShadow: '0 4px 4px rgba(0,200,0,0.4)', backgroundColor: "rgba(0,0,0,0.8)" }}>
                                      <Avatar alt={userDetails.username} src={dp} sx={{ ml: 1 }} /> &nbsp;
                                      {data.content}
                                    </Item>
                                  </Box>
                                )}
                              </Grid>

                              <Grid size={6}>
                                {chat?.chat.Owner !== data.sender && (
                                  <Item sx={{ display: 'flex', color: "black", boxShadow: '0 4px 4px rgba(	27, 40, 69, 0.4)', backgroundColor: "rgba(255,255,255,0.8)"  }}>
                                    <Avatar alt={details.username} src={details.DP} sx={{ ml: 1 }} /> &nbsp;
                                    {data.content}
                                  </Item>
                                )}
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {!hasChat && (
                      <Typography variant="h3" sx={{ color: 'whitesmoke', ml: '1rem', mt: '6rem' }}>
                        Say Hii to start a conversation !!
                      </Typography>
                    )}
                  </CardContent>
                </Box>

                <Box sx={{ py: "0.2rem", mb: "0.3rem", backgroundColor: 'transparent' }}>
                  <Paper
                    component="form"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      color: 'black',
                      backgroundColor: 'rgba(	251, 245, 243, 0.76)',
                      boxShadow: '0 4px 4px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <IconButton sx={{ p: '10px', color: 'black' }} aria-label="menu">
                      <MenuIcon />
                    </IconButton>

                    <InputBase
                      sx={{ ml: 1, flex: 1, color: 'black' }}
                      placeholder="Send a message"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      inputProps={{ 'aria-label': 'send message' }}
                    />

                    <IconButton type="button" sx={{ p: '10px', color: 'black' }} aria-label="send" onClick={handleMessage}>
                      <SendIcon />
                    </IconButton>
                  </Paper>
                </Box>
              </Card>
            </Item>
          </Grid>
        </Grid>
      )}

      {!hasFriends && (
        <Typography variant="h3" sx={{ color: 'whitesmoke', ml: '13rem', mt: '6rem' }}>
          No Friends to Chat With
        </Typography>
      )}
    </Box>
  );
};

export default Chats;
