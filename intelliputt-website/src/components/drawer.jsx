import { Button, Divider, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import {AnimatePresence, motion} from 'framer-motion';

const Drawer = (props) => {

    const [drawerStatus, setDrawerStatus] = useState(false);

    const toggleDrawer = () => {
        setDrawerStatus(!drawerStatus);
        props.onDrawerChange(!drawerStatus);
    }

    const text = props.text;


  return (
    <div>
        <Stack direction= "column" sx={{width:{
            xs:'400px',
            s:'600px',
            sm:'800px',
            lg:'400px',
        }
        }}>

            <Stack direction="row" justifyContent="space-between" alignItems={"center"}>
                <Typography variant="h3" sx={{color:'#21351D'}}>
                    <strong>
                        {props.title}
                    </strong>
                </Typography>
                <Button onClick={toggleDrawer} disableRipple sx={{height:'50px'}}>
                    <Typography variant="h3" sx={{color:'#21351D'}}>
                        {drawerStatus && (
                            <strong>
                                -
                            </strong>
                        )}
                        {!drawerStatus && (
                        <strong>
                            +
                        </strong>
                        )}
                    </Typography>
                </Button>
            </Stack>
        
            <Divider pt={2} sx={{width:'100%'}}/>
            <AnimatePresence>
            

            {drawerStatus && (

            
                <motion.div 
                    animate={{
                        scale: drawerStatus ? 1:0,
                        x: drawerStatus ? 0:-1000,
                        //y: [100, 0],
                        //y: drawerStatus ? 0:0,
                        
                        //width: drawerStatus ? 400 : 400
                        }} 
                     transition={{type: "spring"}}
                     initial={{scale:[0,1], x:[1000, 0]}}
                     exit={{scale:[1,0], x:[0,1000]}}
                >
                    <Typography sx={{color:'white'}}>{text}</Typography>
                </motion.div>
                )}
            </AnimatePresence>
                



        </Stack>
    </div>
  )
}

export default Drawer