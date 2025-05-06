import React from 'react';
import { Box, Typography, Avatar } from '@mui/material'; 
import { useUser } from '../Context/UserContext';

const Home2 = () => {
  const { user } = useUser();
  //console.log(user?.isMobile);
  const inMobile = user?.isMobile;

  const style = {
    pt: { xs: '16px', md: '20px' }, // space for AppBar
    px: 2,
    color: 'white',
    minHeight: '100vh', // ensures it fills screen
    boxSizing: 'border-box',
  };

  return (
    <Box sx={style}>
        <Box sx={{display: "flex"}}>
        <Avatar alt="Remy Sharp" src="Whispr logo.jpg" sx={{ display: { xs: 'none', md: 'flex' } }} />
        <Typography variant="h4" gutterBottom> Welcome to Whispr ✨</Typography>
        </Box>
       
      <Typography variant="body1" paragraph>
        In a world full of noise, Whispr gives you clarity. It’s more than just a chat app — it’s your quiet digital space to connect, share, and belong.
      </Typography>

      <Typography variant="body1" paragraph>
        Whether you're catching up with friends, planning something special, or just saying "hi," Whispr makes every message feel personal and effortless.
      </Typography>

      <Typography variant="body1" paragraph>
        ✅ <strong>Whisper-Smooth Conversations:</strong> Fast, real-time messaging with a lightweight experience that never lags — even on low connections.
      </Typography>

      <Typography variant="body1" paragraph>
        🔐 <strong>Your Privacy, Always Protected:</strong> Messages stay between you and the people you trust. No tracking. No prying eyes. Just you and your words.
      </Typography>

      <Typography variant="body1" paragraph>
        ✨ <strong>Designed for Humans:</strong> Clean design, intuitive features, and no learning curve. Whispr feels like second nature from the first tap.
      </Typography>

      <Typography variant="body1" paragraph>
        🌍 <strong>Stay Close, No Matter the Distance:</strong> Whispr bridges time zones and oceans. Keep conversations going with friends, family, and new connections — wherever they are.
      </Typography>

      <Typography variant="body1" paragraph>
        So go ahead — start a conversation, build a connection, share a moment. <br />
        Because sometimes, the best things start with a whisper.
      </Typography>

      <Typography variant="body1" paragraph>
       Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt ullam in similique, aliquam reiciendis cupiditate explicabo eum odit excepturi dolor soluta! Ut ipsam fugit voluptatum repellat ratione, alias nisi molestiae.
       Nemo animi fugit praesentium ad velit omnis possimus officiis? Est consequatur ullam reiciendis, non vitae quae quos eum cumque, dolorem, iure veniam consectetur sunt tempore recusandae. Suscipit illo non illum?
       Quaerat possimus corporis delectus recusandae at eos quod cupiditate quis dignissimos repudiandae. Dicta atque accusamus reprehenderit possimus vero repudiandae corporis quidem tenetur pariatur! Exercitationem et similique doloribus nobis sint aspernatur!
       Deserunt nulla necessitatibus odio earum iste provident? Necessitatibus unde dignissimos totam iusto fugit distinctio, veritatis iure nesciunt vel! Eos quod facere eius iste. Sunt velit repellendus, quia illum voluptas enim?
       Tenetur in vero, itaque impedit voluptatem ipsam! Vero mollitia praesentium magnam aut? Facilis mollitia necessitatibus illo unde est, eveniet, blanditiis ab hic esse quisquam molestias enim nisi sed quae. Praesentium.
      </Typography>

      
      <Typography variant="body1" paragraph>
       Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt ullam in similique, aliquam reiciendis cupiditate explicabo eum odit excepturi dolor soluta! Ut ipsam fugit voluptatum repellat ratione, alias nisi molestiae.
       Nemo animi fugit praesentium ad velit omnis possimus officiis? Est consequatur ullam reiciendis, non vitae quae quos eum cumque, dolorem, iure veniam consectetur sunt tempore recusandae. Suscipit illo non illum?
       Quaerat possimus corporis delectus recusandae at eos quod cupiditate quis dignissimos repudiandae. Dicta atque accusamus reprehenderit possimus vero repudiandae corporis quidem tenetur pariatur! Exercitationem et similique doloribus nobis sint aspernatur!
       Deserunt nulla necessitatibus odio earum iste provident? Necessitatibus unde dignissimos totam iusto fugit distinctio, veritatis iure nesciunt vel! Eos quod facere eius iste. Sunt velit repellendus, quia illum voluptas enim?
       Tenetur in vero, itaque impedit voluptatem ipsam! Vero mollitia praesentium magnam aut? Facilis mollitia necessitatibus illo unde est, eveniet, blanditiis ab hic esse quisquam molestias enim nisi sed quae. Praesentium.
      </Typography>
    </Box>
  );
};

export default Home2;
