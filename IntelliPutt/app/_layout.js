import { Stack, Tabs } from 'expo-router';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Layout() {
    return (
        
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >

            {/* potentially replace header with tabs and manually code in header?
            but then we have the problem of the animation between pages looking dodgy */}

        </Stack>
        // <Tabs>
        //     <Tabs.Screen
        //     name="index"
        //     options={{href:null}}
        //     screenOptions={{tab}}
            
        //     ></Tabs.Screen>
        // </Tabs>
    

        
        
    );
}