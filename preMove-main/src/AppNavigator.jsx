import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CardStyleInterpolators } from "@react-navigation/stack";

// Navigations
import BottomTabs from "./navigation/BottomTabs"; // Customer Tabs
import ManagerBottomTabs from "./navigation/ManagerBottomTab"; // Manager Tabs

// Screens
import SplashScreen from "./screens/SplashScreen";
import Additem from "./screens/AddInventory";
import LoginPage from "./screens/LoginPage";
import OtpScreen from "./screens/OtpScreen";
import ManagerLoginScreen from "./screens/ManagerScreens/ManagerLoginScreen";
import ManagerOtpScreen from "./screens/ManagerScreens/ManagerOtpScreen";
import CustomerInventoryScreen from "./screens/ManagerScreens/CustomerInventoryScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Splash */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Customer Auth */}
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Otp" component={OtpScreen} />

      {/* Customer Home */}
      <Stack.Screen
        name="HomePage"
        component={BottomTabs}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />

      {/* Manager Auth */}
      <Stack.Screen name="ManagerLogin" component={ManagerLoginScreen} />
      <Stack.Screen name="ManagerOtpScreen" component={ManagerOtpScreen} />
      <Stack.Screen name="CustomerInventoryScreen" component={CustomerInventoryScreen} />

      {/* Manager Home */}
      <Stack.Screen
        name="ManagerHomePage"
        component={ManagerBottomTabs}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />

      {/* Common */}
      <Stack.Screen name="AddItem" component={Additem} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
