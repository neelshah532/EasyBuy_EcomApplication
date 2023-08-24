import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector, useDispatch} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LoginScreen from '../Login/LoginScreen';
import SignupScreen from '../Signup/SignupScreen';
import DashboardScreen from '../Dashboard/DashboardScreen';
import ProductDetailScreen from '../Product/ProductDetailScreen';
import CartScreen from '../Cart/CartScreen';
import OrderSuccess from '../Success/OrderSuccess';
import SellerHomeScreen from '../Seller/SellerHomeScreen';
import ProductUpdateScreen from '../Seller/ProductUpdateScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  return (
    <NavigationContainer>
      {user == null ? (
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      ) : user.type.toLowerCase() == 'normal' ? (
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Tab">
          <Stack.Screen name="Tab" component={BottomTab} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="SellerHome">
          <Stack.Screen name="SellerHome" component={SellerHomeScreen} />
          <Stack.Screen name="ProductUpdate" component={ProductUpdateScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function BottomTab() {
  //var cartCount = useSelector(state => state.cartCount);
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Dashboard') {
            return <FontAwesome name="home" size={size} color={color} />;
          } else if (route.name === 'Cart') {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AntDesign
                  name="shoppingcart"
                  size={size}
                  color={color}
                  style={{marginHorizontal: 15, position: 'relative'}}
                />
              </View>
            );
          }
        },
        tabBarActiveTintColor: '#aa4303',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Dashboard" component={DashboardTab} />
      <Tab.Screen name="Cart" component={MyOrderTab} />
    </Tab.Navigator>
  );
}

function DashboardTab() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Dashboard1">
      <Stack.Screen name="Dashboard1" component={DashboardScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

function MyOrderTab() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Cart1">
      <Stack.Screen name="Cart1" component={CartScreen} />
    </Stack.Navigator>
  );
}

export default App;
