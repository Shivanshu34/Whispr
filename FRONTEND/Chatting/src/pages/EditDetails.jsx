import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import {Container} from '@mui/material';
import '../views/SignUp.css';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import * as Yup from 'yup';

function EditDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data2,setData2] = useState({});
const [formData, setFormData] = useState({
    Bio: '',
    Country: '',
    Nickname: '',
    avatar: null,
  });
  const [errors, setErrors] = useState({});
  const [red, setRed] = useState(false);
  let style;

  const from = location.state?.from || null;
  const userDetails = location.state?.userDetails || null;
  const id2 = userDetails?._id;
  const dp = location.state?.dp || null;
  const detail = location.state?.detail || null;
  let updateInfo;

  useEffect(()=>{
    const dataErr = {
      errMsg: "Can,t access Change Edit page directly or without login",
    }
    if(!from || !userDetails){
      navigate("/failure", {state : dataErr });
    }
  },[]);

  useEffect(() => {
    if (detail) {
      setData2({
        Bio: `Old Bio: ${detail.Bio}`,
        Country: `Old Country: ${detail.Country}`,
        Nickname: `Old Nickname: ${detail.Nickname}`,
      });
    }
  }, [userDetails]);

  let response;

  const validationSchema = Yup.object().shape({
      Bio: Yup.string(),
      Country: Yup.string(),
      Nickname: Yup.string(),
      avatar: Yup.mixed()
      .nullable()
      .test('fileSize', 'File too large', value => {
        if (!value) return true;
         return value.size <= 2 * 1024 * 1024;
       })
        .test('fileType', 'Unsupported File Format', value => {
         if (!value) return true;
          return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
       }),
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to change the details?");
        if (!confirmed) return;
      try {
        await validationSchema.validate({formData},  { abortEarly: false });

        const data = new FormData();
      data.append('Bio', formData.Bio);
      data.append('Country', formData.Country);
      data.append('Nickname', formData.Nickname);
      if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }

        response = await axios.put(
            `http://localhost:4000/details/edit`,
            data,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
         
          let updatedDetail = response?.data?.updatedDetail;
          console.log(updatedDetail);

        const datatoSend = {
            from: location.pathname,
            userDetails: userDetails,
            msg: `Successfully updated your details`,
            dp: updatedDetail?.DP?.url,
            detail: updatedDetail,
          }

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

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const turnRed = () =>{
    setRed(!red);
  }

  const data3 = {
    dp: dp,
    userDetails: userDetails,
    detail: detail,
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const backToHome = ()=>{
    navigate('/home', {state: data3});
  }


  style = red ?  {color: "red"} : {color: "none"};

    return (
      <div className="SignUp">
        <div className="SignUpPage ProfilePage">
        <h1 className='ProfileHeading'><SentimentSatisfiedAltIcon/> Edit Personal Info</h1>
        <br /><br />
        <Button variant="contained" color='secondary' onClick={backToHome}> &nbsp;<HomeIcon/> &nbsp;</Button>
        <Container
         sx={{
         height: '80vh',
         overflowY: 'auto',
        }}
       >
        <form onSubmit={handleFormSubmit}  encType="multipart/form-data">
        <Card sx={{ maxWidth: 345, display: "block", ml: "1.6rem"}}>
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
         multiline
         value={data2?.Bio || "Loading..."}
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
            label="New Bio"
            variant="outlined"
            color="secondary"
            value={formData.Bio}
            onChange={handleChange}
            name="Bio"
            fullWidth
            multiline
            error={Boolean(errors.Bio)}
            helperText={errors.Bio}
        /> <br /><br /><br />
        <TextField
         id="outlined-textarea"
         fullWidth
         value={data2?.Country || "Loading..."}
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
            label="New Country"
            variant="outlined"
            color="secondary"
            value={formData.Country}
            onChange={handleChange}
            name="Country"
            fullWidth
            error={Boolean(errors.Country)}
            helperText={errors.Country}
        /> <br /><br /><br />
        <TextField
         id="outlined-textarea"
         fullWidth
         value={data2?.Nickname || "Loading..."}
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
            label="New Nickname"
            variant="outlined"
            color="secondary"
            value={formData.Nickname}
            onChange={handleChange}
            name="Nickname"
            fullWidth
            error={Boolean(errors.Nickname)}
            helperText={errors.Nickname}
        /> <br /><br /><br />

        <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={<CloudUploadIcon />}
        >
         Upload Profile
        <input type="file" hidden name="avatar" onChange={handleFileChange} />
        </Button>
        {errors.avatar && <p style={{ color: 'red' }}>{errors.avatar}</p>}
        
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
        
    <Button type="submit" variant="contained">Change Details </Button> <br /><br />
    </form>
    </Container>
        </div> 
      </div>
    );
  };
  
  export default EditDetails;