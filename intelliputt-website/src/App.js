import logo from './logo.svg';
import './App.css';
import { Box, Stack, Typography, Grid, Paper } from '@mui/material';
import AddToCartButton from './components/addToCartButton';
import Drawer from './components/drawer';
import { useState } from 'react';
import {motion} from 'framer-motion';
import Footer from './components/footer';
import Header from './components/header';
import IntelliPutLogo from './images/logo-nobg.png';

function App() {

  const [descDrawer, setDescDrawer] = useState(false);
  const [techDrawer, setTechDrawer] = useState(false);
  const [featureDrawer, setFeatureDrawer] = useState(false);

  const handleDescChange = (status) => {
    setDescDrawer(status);
    console.log(status);
  }

  const handleTechChange = (status) => {
    setTechDrawer(status);
    console.log(status);
  }

  const handleFeatureChange = (status) => {
    setFeatureDrawer(status);
    console.log(status);
  }


  return (
    <div className="App">
      {/* <img id="logo" height='81px' width='81px' src={IntelliPutLogo}/> */}

      <Grid container> 
        <Grid item xs={12}>
          <Header/>
        </Grid>
        <Grid item lg={4} sm={6} s={12} xs={12} sx={{display:'flex', alignItems:'center', justifyContent:'center', minHeight: {
          xs: '100vh',  // Adjust the height for extra-small screens
          sm: '100vh',  // Adjust the height for small screens
          md: '100vh',  // Adjust the height for medium screens
          lg: '100vh',  // Adjust the height for large screens
          xl: '100vh',  // Adjust the height for extra-large screens
        }}}>
          <Stack spacing={2} direction="column" sx={{ color:'white', paddingLeft:{
            xs:'0px',
            s:'0px',
            sm:'48px',
          }, alignItems:{
            xs:'center',
            s:'center',
            se:'center',
            sm:'flex-start'
          }}} justifyContent="center"  >
            
              <Typography sx={{fontSize:{
                xs: '96px',
                s:'132px',
                sm: '124px',
                lg:'96px',
                xl:'142px',
              }}} variant="h1">IntelliPutt</Typography>
              <Typography sx={{ alignItems: 'center', fontSize:{
                xs: '36px',
                s:'40px',
                sm:'60px',
              }}} variant="h2">Smart Golfing redefined</Typography>
              <Typography variant="h4">£49.99</Typography>
              <Typography variant="p">Easy to use, portable, and most importantly, assistive</Typography>
              <AddToCartButton/>
          </Stack>
        </Grid>
        <Grid item lg={5} sm={6} s={12} xs={12}>
        </Grid>
        <Grid item lg={3} md={12} sm={12} s={12} xs={12} sx={{display:'flex', justifyContent:'center', minHeight: {
          xs: '100vh',  // Adjust the height for extra-small screens
          sm: '100vh',  // Adjust the height for small screens
          md: '100vh',  // Adjust the height for medium screens
          lg: '100vh',  // Adjust the height for large screens
          xl: '100vh',  // Adjust the height for extra-large screens
        },}}>
          <Stack spacing={5} direction="column"  justifyContent="center">
            <motion.div 
            animate={{
              height: descDrawer ? 150:50
            }}
            >
            
            <Drawer onDrawerChange={handleDescChange} title={"Description"} text="IntelliPutt aims to be a device which lets you practice your golf putting skills. With it's automated systems in place with an accompanying app,
            practicing your putting game has never been easier."/></motion.div>
            <motion.div 
            animate={{
              height: techDrawer ? 100:50, y:[-100, 0]
            }}
            >
            <Drawer onDrawerChange={handleTechChange} title={"Technology"} text="IntelliPut uses multiple pieces of embedded technology to allow you to track your putting performance, as well as integrated hardware to ensure the ball always
            returns to you to hit."/></motion.div>
            <motion.div 
            animate={{
              height: featureDrawer ? 150:50, y:[-100, 0]
            }}
            >
            <Drawer onDrawerChange={handleFeatureChange} title={"Features"} text="IntelliPutt is a smart putting trainer which automatically returns balls to the user and provides users with the option to receive additional statistical feedback 
            through an integrated app. Our product is targeted at aspiring golfers who seek to streamline their training routine, as well as people with limited mobility who require a training device that minimises 
            strain on the body. The ball replacement system utilises a mechanically assisted track to take a golf ball from the target area back towards the user, and then carefully places the ball exactly in a 
            predefined position. If a user misses a putt, a mechanism collects the ball and returns it on the track.  "/></motion.div>
          </Stack>
        </Grid>
        <Grid item xs={12} s={12} lg={12}>
          <Footer/>
        </Grid>

      </Grid>




      {/* <Stack direction="row" sx={{height:'100%'}} justifyContent="space-between">
        <Stack spacing={2} direction="column" sx={{width:'30%', color:'white'}} justifyContent="center" ml={15}>
            <Typography variant="h1">IntelliPutt</Typography>
            <Typography variant="h2">Smart Golfing redefined</Typography>
            <Typography variant="h4">£49.99</Typography>
            <Typography variant="p">Easy to use, portable, and most importantly, assistive</Typography>
            <AddToCartButton/>
        </Stack>
        <Stack spacing={5} direction="column" justifyContent="flex-end" pb={20} sx={{width:'30%'}} pr={8}>
          <motion.div 
          animate={{
            height: descDrawer ? 100:50
          }}
          >
          
          <Drawer onDrawerChange={handleDescChange} title={"Description"} text="IntelliPutt aims to be a device which lets you practice your golf putting skills. With it's automated systems in place with an accompanying app,
          practicing your putting game has never been easier."/></motion.div>
          <motion.div 
          animate={{
            height: techDrawer ? 100:50, y:[-100, 0]
          }}
          >
          <Drawer onDrawerChange={handleTechChange} title={"Technology"} text="IntelliPut uses multiple pieces of embedded technology to allow you to track your putting performance, as well as integrated hardware to ensure the ball always
          returns to you to hit."/></motion.div>
          <motion.div 
          animate={{
            height: featureDrawer ? 150:50, y:[-100, 0]
          }}
          >
          <Drawer onDrawerChange={handleFeatureChange} title={"Features"} text="IntelliPutt is a smart putting trainer which automatically returns balls to the user and provides users with the option to receive additional statistical feedback 
          through an integrated app. Our product is targeted at aspiring golfers who seek to streamline their training routine, as well as people with limited mobility who require a training device that minimises 
          strain on the body. The ball replacement system utilises a mechanically assisted track to take a golf ball from the target area back towards the user, and then carefully places the ball exactly in a 
          predefined position. If a user misses a putt, a mechanism collects the ball and returns it on the track.  "/></motion.div>
        </Stack>
       
        
      </Stack> */}
    </div>
  );
}

export default App;
