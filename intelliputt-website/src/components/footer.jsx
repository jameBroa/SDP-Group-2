import { Stack, Typography } from '@mui/material'
import React from 'react'

const Footer = () => {
  return (
    <div>
        <Stack direction="row" justifyContent="center" sx={{color:'#3a5933', backgroundColor:'#21351D', height:{
            xs:'200px'
        }}}>
            <Stack direction="column" justifyContent="flex-end">
                <Typography>All Rights Reserved</Typography>
                <Typography>© COPYRIGHT 2024</Typography>
            </Stack>
            
        
        
        </Stack>
    </div>
  )
}

export default Footer