import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';


import ProductListScreen from '../screens/ProductList/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Login from '../screens/Auth/Login';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);


const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={ProductListScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProductList"
      component={ProductListScreen}
      options={({ route }) => ({
        title:  'Products',
        headerBackTitle: 'Back',
        headerShown: false
      })}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{
        title: 'Product Details',
        headerBackTitle: 'Back'
      }}
    />

    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={{
        title: 'Your Cart',
        headerBackTitle: 'Back',
        headerShown: false

      }}
    />
  </Stack.Navigator>
);


const OrdersStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Orders"
      component={OrdersScreen}
      options={{ title: 'Your Orders', headerShown: false }}
    />
  </Stack.Navigator>
);



const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeTab') {
          iconName = focused ? 'home' : 'home';
        } else if (route.name === 'OrdersTab') {
          iconName = focused ? 'receipt' : 'receipt';
        } else if (route.name === 'profile') {
          iconName = focused ? 'person' : 'person';
        } else if (route.name === 'CartTab') {
          iconName = focused ? 'shopping-cart' : 'shopping-cart';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2ecc71',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        paddingBottom: 5,
        height: 70,
      },
      tabBarLabelStyle: {
        fontSize: 14,
        marginBottom: 6,
        fontFamily: "",
      },
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{ title: 'Home' }}
    />
    <Tab.Screen
      name="CartTab"
      component={CartScreen}
      options={{ title: 'Cart' }}
    />
    <Tab.Screen
      name="OrdersTab"
      component={OrdersStack}
      options={{ title: 'Orders' }}
    />
    <Tab.Screen
      name="profile"
      component={ProfileScreen}
      options={{ title: 'Profile', headerShown: true }}
    />


  </Tab.Navigator>
);


const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loginData = useSelector((state) => state.rootReducer.loginData.arr);
  const token = AsyncStorage.getItem('token');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const isTokenValid = !!token && token.trim() !== '';
        const isLoginDataValid = loginData && Object.keys(loginData).length > 0;

        setIsAuthenticated(isTokenValid || isLoginDataValid);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [loginData]);

  console.log(isAuthenticated, "isAuthenticated", token, loginData)
  if (isLoading) {
    return null; 
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

    
      {isAuthenticated ? (

        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="HomeStack" component={HomeStack} />
          <Stack.Screen name="OrdersStack" component={OrdersStack} />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'My Profile', headerShown: true }}
          />

   
        </>
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;