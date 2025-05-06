import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../views/SignUp.css';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useUser } from '../Context/UserContext.jsx';

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let dp = null;

  const { setUser } = useUser();

  if(!location.state?.from){
    useEffect(()=>{
      const signUpLoc = location.state?.from;
      const errMsg = signUpLoc !== '/signup' ? "Can't access details page directly" : " ";
      const dataToSendErr ={
        errMsg,
      };
    
      if(errMsg !== " "){
        navigate("/success", {state: dataToSendErr});
      }
    },[navigate]);
  }

  const [formData, setFormData] = useState({
    Bio: '',
    Country: '',
    Nickname: '',
    avatar: null,
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const data = new FormData();
      data.append('Bio', formData.Bio);
      data.append('Country', formData.Country);
      data.append('Nickname', formData.Nickname);
      if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }

      const response = await axios.post(
        "http://localhost:4000/details/add",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const user = location.state?.user;
      dp = response?.data?.detail?.DP?.url;
      const userDetails = location.state?.userDetails;
      const detail = response?.data?.detail || null;
    
      const dataToSend = { 
        from: location.pathname, 
        user: user,
        dp: dp,
        userDetails: userDetails,
        detail: detail,
      };

      setUser(dataToSend);

      navigate("/success", { state: dataToSend });
      
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  return (
    <div className="SignUp">
      <div className="SignUpPage DetailsPage">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="SignUpDiv">
            <h1 className="SignUpHeading">Add Info</h1>
            <p className="SignUpPara">Welcome user, add details if you want</p>

            <div className="SignUpWrap">
              <Stack spacing={2} ml={3} mr={4}> 
                <TextField
                  label="Bio"
                  variant="outlined"
                  color="secondary"
                  value={formData.Bio}
                  onChange={handleChange}
                  name="Bio"
                  fullWidth
                  error={Boolean(errors.Bio)}
                  helperText={errors.Bio}
                />

                <TextField
                  label="Nickname"
                  variant="outlined"
                  color="secondary"
                  value={formData.Nickname}
                  onChange={handleChange}
                  name="Nickname"
                  fullWidth
                  error={Boolean(errors.Nickname)}
                  helperText={errors.Nickname}
                />

                <TextField
                  label="Country"
                  variant="outlined"
                  color="secondary"
                  value={formData.Country}
                  onChange={handleChange}
                  name="Country"
                  fullWidth
                  error={Boolean(errors.Country)}
                  helperText={errors.Country}
                />

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

                <Button type="submit" variant="contained" fullWidth>Submit</Button>
              </Stack>

              <div>
                <p>
                  Want to &nbsp;&nbsp;&nbsp;&nbsp;
                  <Link component={RouterLink} to="/success" state={{ from: location.pathname, 
                   user: location.state?.user,
                   dp: dp,
                   userDetails: location.state?.userDetails }} underline="hover" ml={-2}>
                    skip
                  </Link> <br /> 
                  don't want to add personal info
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Details;
