import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import MessageIcon from '@mui/icons-material/Message';
import {
  Toolbar,
  Box,
  Drawer
} from '@mui/material';
import { useUser } from '../Context/UserContext';

const drawerWidth = 230;

function Sidebar({from, detail}) {
  const sidebar1 = ['Home', 'Search', 'Friends', 'Groups'];
  const sidebar2 = ['Chats', 'Blocked Friends', 'Requests Sent', 'Requests Receive'];

   const { user } = useUser();
      const userDetails = user?.userDetails || null;
      const dp = user?.dp || 'https://res.cloudinary.com/dxhyznlyz/image/upload/v1746439138/default-avatar_xfrwa6.jpg';

  const navigate = useNavigate();
  const location = useLocation();

  const data = {
    from: from,
    userDetails: userDetails,
    dp: dp,
    detail: detail,
  }

  const handleClick = (page) => {
    if(page === 'Home'){
      navigate('/home', { state: data });
    }else if(page === 'Search'){
      navigate('/search', { state: data });
    }else if(page === 'Friends'){
      navigate('/friends', { state: data });
    }else if(page === 'Groups'){
      navigate('/home', { state: data });
    }
  }

  const handleClick2 = (page) => {
    if(page === 'Chats'){
      navigate('/chats', { state: data });
    }else if(page === 'Blocked Friends'){
      navigate('/blockedfriends', { state: data });
    }else if(page === 'Requests Sent'){
      navigate('/requestssent', { state: data }); 
    }else if(page === 'Requests Receive'){
      navigate('/requestsreceive', { state: data });
    }
  }
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box',backgroundColor: "rgba(39, 48, 67, 0.55)", },
        }}
      >
        <Toolbar/>
        <Box sx={{ overflow: 'auto'}}>
          <List>
            {sidebar1.map((text, index) => (
              <ListItem key={text} disablePadding sx={{color: "whitesmoke"}}> 
                <ListItemButton onClick={() => handleClick(text)}>
                  <ListItemIcon sx={{color: "whitesmoke"}}>
                    {index === 0 && <HomeIcon/>}
                    {index === 1 && <SearchIcon/>}
                    {index === 2 && <GroupIcon/>}
                    {index === 3 && <Diversity3Icon/>}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {sidebar2.map((text, index) => (
              <ListItem key={text} disablePadding sx={{color: "whitesmoke"}}>
                <ListItemButton onClick={() => handleClick2(text)}>
                  <ListItemIcon sx={{color: "whitesmoke"}}>
                    {index === 0 && <MessageIcon/>}
                    {index === 1 && <GroupRemoveIcon/>}
                    {index === 2 && <GroupAddIcon/>}
                    {index === 3 && <CallReceivedIcon/>}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      </>
  );
}

export default Sidebar;
