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
import * as Yup from 'yup';

function ChangeUsername() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data,setData] = useState({});
  const [newUsername, setNewUsername] = useState("");
  const [errors, setErrors] = useState({});
  const [red, setRed] = useState(false);
  let style;

  const from = location.state?.from || null;
  const userDetails = location.state?.userDetails || null;
  const id2 = userDetails?._id;
  const dp = location.state?.dp || null;
  const detail = location.state?.detail || null;
  let updateInfo;

  let username2 = userDetails?.username;

  useEffect(()=>{
    const dataErr = {
      errMsg: "Can,t access Change Username page directly or without login",
    }
    if(!from || !userDetails){
      navigate("/failure", {state : dataErr });
    }
  },[]);

  useEffect(() => {
    if (userDetails?.username) {
      setData({
        username: `Old Username: ${userDetails.username}`,
      });
    }
  }, [userDetails]);

  let response;

   const validationSchema = Yup.object().shape({
      newUsername: Yup.string().required("Usename can't be empty string"),
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to change the username?");
        if (!confirmed) return;
      try {
        await validationSchema.validate({newUsername},  { abortEarly: false });
        response = await axios.put(
            `http://localhost:4000/user/edit`,
            { id: id2, newUsername },
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
        updateInfo = response?.data;
       // console.log(updateInfo?.user);

        const datatoSend = {
            from: location.pathname,
            user: newUsername,
            userDetails: updateInfo?.user,
            msg: `Successfully updated your username ${newUsername}`,
            dp: dp,
            detail: detail,
          }
          //console.log("Hii");

        navigate('/success', {state: datatoSend});

      } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            error.inner.forEach((err) => {
                validationErrors[err.path] = err.message;
        });
                setErrors(validationErrors);
         } else {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
      }
    };

  const handleChange = (e)=>{
    setNewUsername(e.target.value);
    setErrors({});
  }

  const turnRed = () =>{
    setRed(!red);
  }

  const data3 = {
    dp: dp,
    userDetails: userDetails,
    detail: detail,
  }

  const backToHome = ()=>{
    navigate('/home', {state: data3});
  }


  style = red ?  {color: "red"} : {color: "none"};

    return (
      <div className="SignUp">
        <div className="SignUpPage ProfilePage">
        <h1 className='ProfileHeading'><SentimentSatisfiedAltIcon/> Change Username</h1>
        <br /><br />
        <Button variant="contained" color='secondary' onClick={backToHome}> &nbsp;<HomeIcon/> &nbsp;</Button>
        <Container
         sx={{
         height: '80vh',
         overflowY: 'auto',
        }}
       >
        <form onSubmit={handleFormSubmit}>
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
        title={data?.username || "Loading..."}
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
         fullWidth
         value={data?.username || "Loading..."}
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
         label="New Username"
         fullWidth
         value={newUsername}
         onChange={handleChange}
         error={Boolean(errors.username)}
         helperText={errors.username}
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
        
    <Button type="submit" variant="contained">Change Username </Button> <br /><br />
    </form>
    </Container>
        </div> 
      </div>
    );
  };
  
  export default ChangeUsername;