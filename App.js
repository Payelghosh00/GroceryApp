import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/globalStyles';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light} />
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default App;