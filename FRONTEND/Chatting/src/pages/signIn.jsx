import React, { useState } from 'react';
import { Box, TextField, Button, Stack, Link } from '@mui/material';
import {AccountCircle} from '@mui/icons-material';
import '../views/SignUp.css';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useUser } from '../Context/UserContext.jsx';

const SignIn = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const { setUser } = useUser();

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const validationSchema = Yup.object().shape({
    identifier: Yup.string().required('Enter a username or an email'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const { identifier, password } = formData;
      const response = await axios.post(
        "http://localhost:4000/user/login",
        { identifier, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log('Form submitted:', response);
      const userDetails = response.data?.user;
      const detail = response.data?.detail;

      const data = {
        from: location.pathname,
        user: formData.identifier,
        userDetails: userDetails,
        dp: response.data?.detail?.DP?.url,
        detail: detail,
      }

      setUser(data);
    
      navigate("/success", { state: data }); 
      // Optionally, display a success message or redirect the user
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else if (error.response) {
        if (error.response.status === 401) {
          // Unauthorized error
          if(error.response?.data?.message){
            const serverError ={};
            if(error.response?.data?.message === "Enter a valid username or email"){
              serverError.identifier = "Enter a valid username or email";
            }
            else if(error.response?.data?.message === "Enter a valid password"){
              serverError.password = "Enter a valid password";
            }
            setErrors(serverError);
          }
          toast.error(error.response?.data?.message || 'An error occured');
        }   
      } else {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="SignUp">
      <div className="SignUpPage SignInPage">
        <form onSubmit={handleSubmit}>
          <div className="SignUpDiv">
            <h1 className="SignUpHeading">Sign In</h1>
            <p className="SignUpPara">Welcome user, please sign in to continue</p>
            
            <div className='SignUpWrap'>
            <Stack spacing={2} ml={3} mr={4}>
             <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <AccountCircle sx={{ color: 'action.active', my: 0.5,  mr: 1}} />
              <TextField 
                id="input-with-sx" 
                label="Username or email" 
                variant="standard"
                value={formData.identifier}
                onChange={handleChange}
                name="identifier"
                fullWidth
                error={Boolean(errors.identifier)}
                helperText={errors.identifier}
              />
             </Box>

              <TextField
                id="standard-password"
                label="Password"
                variant="standard"
                type="password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password}
              />

             <Button type="submit" variant="contained" fullWidth>Sign In</Button>
            </Stack>
               <div>
             <p>Want to &nbsp; &nbsp;<Link href="/signup" underline="hover" ml={-2}> sign up</Link> <br /> don't have an account</p>
             </div> 

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
