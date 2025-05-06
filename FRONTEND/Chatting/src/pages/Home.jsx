import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../views/Home.css';
import CustomAppBar from '../utils/CustomAppBar';
import Sidebar from '../utils/Sidebar';
import Bottom from '../utils/Bottom';
import { useUser } from '../Context/UserContext';

const Home = (props) => {
  const ref = React.useRef(null); 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const location = useLocation();
  const { user } = useUser();
  const { window } = props; 

  const dp =
    user?.dp ||
    'https://res.cloudinary.com/dxhyznlyz/image/upload/v1746439138/default-avatar_xfrwa6.jpg';

  const userDetails = user?.userDetails || null;
  const detail = user?.detail || null;
  const from = location.pathname;
  
  console.log(userDetails);
  // console.log(dp);

  return (
    <div className="Home" ref={ref}>
      {isMobile ? (
        <>
          <CustomAppBar inMobile={true} from={from} detail={detail}/>
          <Bottom></Bottom>
         </>
      ) : (
        <>
         <CustomAppBar inMobile={false} from={from} detail={detail}/>
         <Sidebar from={from} detail={detail}/>
        </>
      )}
    </div>
  );
};

export default Home;
