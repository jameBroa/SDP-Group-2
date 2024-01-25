import { Button, ThemeProvider, Typography, createTheme } from '@mui/material'
import React from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  palette: {
    anger: createColor('#F40B27'),
    apple: createColor('#5DBA40'),
    steelBlue: createColor('#5C76B7'),
    violet: createColor('#BC00A3'),
    white: createColor('#ffffff'),
  },
});


const AddToCartButton = () => {
  return (
    <div>
        <ThemeProvider theme={theme}>
            <Button startIcon={<ShoppingCartIcon/>} color="white" variant="contained" 
            sx={{
                height:'60px', 
                width:'200px',
                textTransform:'none', 
                borderRadius:'40px', 
                border: 'solid', 
                borderColor:'black', 
                borderWidth:'2px',
                }}>
                <Typography sx={{color:'black'}}>Add to cart</Typography>
            </Button>
        </ThemeProvider>

    </div>
  )
}

export default AddToCartButton