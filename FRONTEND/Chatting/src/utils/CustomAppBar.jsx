import * as React from 'react';
import toast from 'react-hot-toast';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Container,
  Box,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { useUser } from '../Context/UserContext';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function RateUsDialog({ open, onClose }) {
  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);

  const handleSubmit = () => {
    toast.success("Thanks for your rating! ⭐");
    onClose();
  };

  const handleClose = () => {
    toast.error("You cancelled rating us 😔");
    onClose();
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rate Us!</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ width: 200, display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
          <Rating
            name="hover-feedback"
            value={value}
            precision={0.5}
            getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {value !== null && (
            <Box>{labels[hover !== -1 ? hover : value]}</Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function CustomAppBar({inMobile, from, detail}) {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openRateDialog, setOpenRateDialog] = React.useState(false);
    let settings = ['Profile', 'Change username', 'Edit personal info', 'Logout'];
    const { user } = useUser();
    const userDetails = user?.userDetails || null;
    const dp = user?.dp || 'https://res.cloudinary.com/dxhyznlyz/image/upload/v1746439138/default-avatar_xfrwa6.jpg';
    let position;

   // console.log(userDetails);

    settings = userDetails ? ['Profile', 'Change username', 'Edit personal info', 'Logout'] : ['SignIn', 'SignUp'];
    const pages = ['About us', 'Rate us', 'Game'];

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
      };
      const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
      };
    
      const handleCloseNavMenu = () => {
        setAnchorElNav(null);
      };
    
      const handleCloseUserMenu = () => {
        setAnchorElUser(null);
      };

      const data = {
        from: from,
        userDetails: userDetails,
        dp: dp,
        detail: detail,
      }

      const handleNavClick = (page) => {
        if(userDetails){
          if(page === 'Profile'){
            navigate('/profile', { state: data });
          }else if(page === 'Change username'){
            navigate('/ChangeUsername', { state: data });
          }else if(page === 'Edit personal info'){
            navigate('/editDetails', { state: data });
          }else if(page === 'Logout'){
            navigate('/logout', { state: data });
          }
        }
        else{
          if(page === 'SignIn'){
            navigate('/signin');
          }
          else if(page === 'SignUp'){
            navigate('/signup');
          }
        }
        handleCloseNavMenu();
      }

      const handleNavClick2 = React.useCallback((page) => {
        handleCloseNavMenu();
        document.activeElement.blur();
        if (page === 'About us') {
          navigate('/about', { state: data });
        } else if (page === 'Rate us') {
          setOpenRateDialog(true);
        }
      }, [navigate, data]);

      if(inMobile){
        position = "static";
      }
      else{
        position = "fixed";
      }
    return (
      <>
           <AppBar position={position} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "rgba(136,136,136,0)" }}>
            <CssBaseline />
                <Container maxWidth="xl" sx={{ height: "3.5rem"}}>
                  <Toolbar disableGutters>
                    <Avatar alt="Remy Sharp" src="Whispr logo.jpg" sx={{ display: { xs: 'none', md: 'flex' } }} />
                    <Typography
                      variant="h6"
                      noWrap
                      component="a"
                      href="#app-bar-with-responsive-menu"
                      sx={{
                        ml: '1.6vw',
                        mr: '30vw',
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      WHISPR
                    </Typography>
        
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                      >
                        <MenuIcon sx={{color: 'inherit'}}/>
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                      >
                 {pages.map((page) => (
                 <MenuItem key={page} onClick={() => handleNavClick2(page)}>
                 <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                 </MenuItem>
                ))}


                      </Menu>
                    </Box>
                    <Avatar alt="Remy Sharp" src="Whispr logo.jpg" sx={{ display: { xs: 'flex', md: 'none' } }} />
                    <Typography
                      variant="h5"
                      noWrap
                      component="a"
                      href="#app-bar-with-responsive-menu"
                      sx={{
                        mr: 1.8,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      WHISPR
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, color: 'inherit' }}>
                    {pages.map((page) => (
                    <MenuItem key={page} onClick={() => handleNavClick2(page)}>
                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                    </MenuItem>
                    ))}

                      {/* {showAlert && <Alerts onClose={() => setShowAlert(false)} />} */}

                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                      <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mt: "-0.91rem" }}>
                          <Avatar alt="Remy Sharp" src={dp} />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        sx={{ mt: '45px', color:'black' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        {settings.map((setting) => (
                          <MenuItem key={setting} onClick={()=>handleNavClick(setting)}>
                            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  </Toolbar>
                </Container>
              </AppBar>

             <RateUsDialog open={openRateDialog} onClose={() => setOpenRateDialog(false)} />
        </>
    );
}

export default CustomAppBar;