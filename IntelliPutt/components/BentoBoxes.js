import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import COLOURS from '../static/design_constants'

const BentoBoxes = () => {
  return (
    <View style={styles.container}>
        
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row', // Set to 'column' if you want a column-based grid
      flexWrap: 'wrap', // Allows items to wrap onto the next line
      justifyContent: 'center',
      gap:'10%',
      alignItems: 'center',
      paddingTop:10,
    },
    gridItemBox: {
      // Add styling for individual grid items if needed
      width: '45%', // Adjust as needed based on the number of columns you want
    aspectRatio: 1, // Maintain square aspect ratio for each grid item
        backgroundColor: COLOURS.DARK_GREEN,
        borderRadius:'10px'
    },
    gridItemRecW: {
        // Add styling for individual grid items if needed
        width: '93%', // Adjust as needed based on the number of columns you want
        // aspectRatio: 1, // Maintain square aspect ratio for each grid item
        height:'45%',
        borderRadius:'10px',
        backgroundColor: COLOURS.DARK_GREEN,
      },
      gridItemRecH: {
        // Add styling for individual grid items if needed
        width: '45%', // Adjust as needed based on the number of columns you want
        aspectRatio: 0.5, // Maintain square aspect ratio for each grid item
        borderRadius:'10px',
        backgroundColor: COLOURS.DARK_GREEN,
      },
    
  });

export default BentoBoxes