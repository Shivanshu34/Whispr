import React, { useState } from 'react';
import { TextField, Button, Stack, Link } from '@mui/material';
import '../views/SignUp.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useUser } from '../Context/UserContext.jsx';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const { setUser } = useUser();

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const { email, username, password } = formData;
      const response = await axios.post(
        "http://localhost:4000/user/signUp",
        { email, username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const userDetails = response?.data?.user;
      console.log('Form submitted:', response);
      const data = {
        from: location.pathname,
        user: formData.username,
        userDetails: userDetails,
      }

      setUser(data);
    
      navigate("/details", { state: data }); 
      // Optionally, display a success message or redirect the user
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

  return (
    <div className="SignUp">
      <div className="SignUpPage">
        <form onSubmit={handleSubmit}>
          <div className="SignUpDiv">
            <h1 className="SignUpHeading">Sign Up</h1>
            <p className="SignUpPara">Welcome user, please sign up to continue</p>
            
            <div className='SignUpWrap'>
            <Stack spacing={2} ml={3} mr={4}>
              <TextField
                id="outlined-email"
                label="Email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                name="email"
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                id="filled-username"
                label="Username"
                variant="filled"
                value={formData.username}
                onChange={handleChange}
                name="username"
                fullWidth
                error={Boolean(errors.username)}
                helperText={errors.username}
              />
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

             <Button type="submit" variant="contained" fullWidth>Sign Up</Button>
            </Stack>
             
             <div>
             <p>Want to &nbsp; &nbsp;<Link href="/signin" underline="hover" ml={-2}> sign in</Link> <br /> already have an account</p>
             </div>
            
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
