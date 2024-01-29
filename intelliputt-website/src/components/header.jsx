import { Button, Stack, Typography } from '@mui/material'
import React from 'react'
import IntelliPutLogo from '../images/logo-nobg.png';

const Header = () => {
  return (
    <div>
        <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ height:{
            lg:'101px',
            xs:'101px'
        }}}>
            <Button sx={{color:'white', textTransform:'none', width:{
                xs:'100px',
            }}}>
                <Typography>About</Typography>
            </Button>
            <img height='81px' width='81px' src={IntelliPutLogo}/>
            <Button sx={{color:'white',textTransform:'none', width:{
                xs:'100px',
            }}}>
                <Typography>Contact us</Typography>
            </Button>


        </Stack>


    </div>
  )
}

export default Header