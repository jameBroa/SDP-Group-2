import { Link, Stack } from 'expo-router';
import { Image, Text, View } from 'react-native';
import COLOURS from '../static/design_constants';

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('../static/logo_transparent.png')}
    />
  );
}

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLOURS.MEDIUM_GREEN },
          headerTintColor: COLOURS.TINT,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Text>Home Screen</Text>
      <Link href={{ pathname: 'details', params: { name: 'Bacon' } }}>Go to Details</Link>
    </View>
  );
}