import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomAppBar from '../utils/CustomAppBar';
import Sidebar from '../utils/Sidebar';
import Bottom from '../utils/Bottom';
import { Box } from '@mui/material';
import { useUser } from '../Context/UserContext';
import '../views/Home.css';

function MainLayout({ type }) {
  let mt = "3.5rem";
  let height = "90vh";
  let overflowY = "auto";
  let backgroundColor = 'rgba(0,0,0,0.5)';

  if (type === "chat") {
    overflowY = "hidden";
    backgroundColor = 'rgba(0,0,0,0.45)';
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { user } = useUser();

  const dp = user?.dp || 'https://res.cloudinary.com/dxhyznlyz/image/upload/v1746439138/default-avatar_xfrwa6.jpg';
  const userDetails = user?.userDetails || null;
  const detail = user?.detail || null;
  const from = location.pathname;

  return (
    <div className="Home" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CustomAppBar dp={dp} inMobile={isMobile} userDetails={userDetails} from={from} detail={detail} />

      <Box sx={{ display: 'flex', flex: 1, mt }}>
        {!isMobile && <Sidebar />}

        <Box
          sx={{
            flex: 1,
            height,
            overflowY,
            px: 2,
            backgroundColor,
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {isMobile && <Bottom />}
    </div>
  );
}

export default MainLayout;
