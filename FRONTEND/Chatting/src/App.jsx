import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { Box } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Toaster } from 'react-hot-toast';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/signIn.jsx';
import Success from './pages/Success.jsx';
import Details from './pages/Details.jsx';
import Profile from './pages/Profile.jsx';
import Failure from './pages/Failure.jsx';
import ChangeUsername from './pages/ChangeUsername.jsx';
import EditDetails from './pages/EditDetails.jsx';
import Logout from './pages/logout.jsx';
import AboutUs from './pages/AboutUs.jsx';
import SearchPage from './pages/searchPage.jsx';
import MainLayout from './Layout/MainLayout.jsx';
import Friends from './pages/Friends.jsx';
import BlockedFriends from './pages/BlockedFriends.jsx';
import RequestReceived from './pages/RequestsReceived.jsx';
import RequestSent from './pages/RequestSent.jsx';
import Chats from './pages/Chats.jsx';
import Home2 from './pages/Home2.jsx';
import NotFound from './pages/NotFound.jsx';

import { UserProvider, useUser } from './Context/UserContext.jsx';

function ViewportUpdater() {
  useEffect(() => {
    const updateViewportUnits = () => {
      const vh = window.innerHeight * 0.01;
      const vw = window.innerWidth * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--vw', `${vw}px`);
    };

    updateViewportUnits();
    window.addEventListener('resize', updateViewportUnits);
    return () => {
      window.removeEventListener('resize', updateViewportUnits);
    };
  }, []);
  return null;
}

function RouteTracker() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
 
  const location = useLocation();
  const { user, setUser } = useUser();

  useEffect(() => {
    if (user?.from !== location.pathname) {
      setUser({ ...user, from: location.pathname }); 
    }
    setUser({ ...user, isMobile });
  }, [location.pathname]);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/success" element={<Success />} />
      <Route path="/details" element={<Details />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/failure" element={<Failure />} />
      <Route path="/ChangeUsername" element={<ChangeUsername />} />
      <Route path="/EditDetails" element={<EditDetails />} />
      <Route path="/logout" element={<Logout />} />

      <Route element={<MainLayout type="default" />}>
        <Route path="/" element={<Home2 />} />
        <Route path="/home" element={<Home2 />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/blockedfriends" element={<BlockedFriends />} />
        <Route path="/requestsreceive" element={<RequestReceived />} />
        <Route path="/requestssent" element={<RequestSent />} />
      </Route>

      <Route element={<MainLayout type="chat" />}>
        <Route path="/chats" element={<Chats />} />
      </Route>

      <Route path="/*" element={<NotFound/>}></Route>
    </Routes>
  );
}

function App() {
  const theme = createTheme(); // You can customize the theme if needed

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <UserProvider>
          <Toaster />
          <ViewportUpdater />
          <RouteTracker />
          <AppRoutes />
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}


export default App;