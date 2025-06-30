import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ChatScreen from './screens/chatScreen';
import RiskProfile from './screens/riskProfile';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './navigation';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Chat"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="RiskProfile" component={RiskProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
