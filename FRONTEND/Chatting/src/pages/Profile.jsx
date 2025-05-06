import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import {Container} from '@mui/material';
import '../views/SignUp.css';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [red, setRed] = useState(false);
  // const [username, setUsername] = useState("");
  const [date2,setDate2] = useState("");
  const [data,setData] = useState({});
  let style;

  const from = location.state?.from || null;
  const userDetails = location.state?.userDetails || null;
  const dp = location.state?.dp || null;
  const detail = location.state?.detail || null;
  let profileInfo;

 let isoDate;

const options = { year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(()=>{
    const dataErr = {
      errMsg: "Can,t access Profile page directly or without login",
    }
    if(!from || !userDetails){
      navigate("/failure", {state : dataErr });
    }
  },[]);
  let response;
  //console.log(userDetails._id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        response = await axios.get(
          `http://localhost:4000/user/info/${userDetails._id}`,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        profileInfo = response?.data;

        let username = response?.data?.user?.user?.username; 

        isoDate = response?.data?.user?.user?.createdAt;
        let newDate = new Date(isoDate);
        let formattedDate = newDate.toLocaleDateString('en-US', options);
        let date = formattedDate || "N/A";
        setDate2(formattedDate);

        let email = response?.data?.user?.user?.email;

        let Bio = response?.data?.user?.detail?.Bio || "N/A";

        let Nickname = response?.data?.user?.detail?.Nickname || "N/A";

        let Country = response?.data?.user?.detail?.Country || "N/A";

        const data2 = {
          username: `Username: ${username}`,
          email: `Email: ${email}`,
          date: `Created Profile At: ${date}`,
          Bio: `Bio: ${Bio}`,
          Nickname: `Nickname: ${Nickname}`,
          Country: `Country: ${Country}`,
        }

        setData(data2);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'An error occurred');
      }
    };
  
    fetchProfile();
  }, []);

  const data3 = {
    dp: dp,
    userDetails: userDetails,
    detail: detail,
  }
  
  const backToHome = ()=>{
    navigate('/home', {state: data3});
  }

  const turnRed = () =>{
    setRed(!red);
  }

  style = red ?  {color: "red"} : {color: "none"};

    return (
      <div className="SignUp">
        <div className="SignUpPage ProfilePage">
        <h1 className='ProfileHeading'><SentimentSatisfiedAltIcon/> My Profile</h1>
        <Container
         sx={{
         height: '80vh',
         overflowY: 'auto',
        }}
       >
        <Card sx={{ maxWidth: 345, display: "block", ml: "1.6rem"}}>
      <CardHeader
        avatar={
          <Avatar alt="User" src={dp} />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
         title= {data.username}
         subheader={date2}
      />
      <CardMedia
        component="img"
        height="194"
        image={dp}
        alt="Profile Pic"
      />
      <CardContent>
      <TextField
          id="outlined-textarea"
          multiline
          fullWidth
          value={data.Bio}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              color: 'black',
            },
          }}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon onClick={turnRed} sx={style}/>
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
    <br /><br />
    <Container
      sx={{
        maxWidth: 350
      }}
      >
        <TextField
         id="outlined-textarea"
         multiline
         fullWidth
         value={data.username}
         slotProps={{
           input: {
             readOnly: true,
           },
         }}
         sx={{
          '& .MuiInputBase-input.Mui-disabled': {
            color: 'black',
          },
        }}
       />
       <br /><br /><br />

        <TextField
         id="outlined-textarea"
         multiline
         fullWidth
         value={data.email}
         slotProps={{
           input: {
             readOnly: true,
           },
         }}
       />
        <br /><br /><br />

        <TextField
         id="outlined-textarea"
         multiline
         fullWidth
         value={data.Nickname}
         slotProps={{
           input: {
             readOnly: true,
           },
         }}
         sx={{
          '& .MuiInputBase-input.Mui-disabled': {
            color: 'black',
          },
        }}
       />
       <br /><br /><br />

       <TextField
         id="outlined-textarea"
         multiline
         fullWidth
         value={data.Country}
         slotProps={{
           input: {
             readOnly: true,
           },
         }}
         sx={{
          '& .MuiInputBase-input.Mui-disabled': {
            color: 'black',
          },
        }}
       />
       <br /><br /><br />

       <TextField
         id="outlined-textarea"
         multiline
         fullWidth
         value={data.date}
         slotProps={{
           input: {
             readOnly: true,
           },
         }}
         sx={{
          '& .MuiInputBase-input.Mui-disabled': {
            color: 'black',
          },
        }}
       />
       <br /><br /><br />
      </Container>
    <Button variant="contained" onClick={backToHome}>Back to Home &nbsp;<HomeIcon/></Button>
    </Container>
        </div> 
      </div>
    );
  };
  
  export default Profile;