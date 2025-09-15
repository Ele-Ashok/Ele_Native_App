import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import colors from "../theme/colors";

// Heroicons
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";

// Manager Screens
import ManagerHomeScreen from "../screens/ManagerScreens/ManagerScreen";
import ApprovalRequests from "../screens/ManagerScreens/ApprovalRequests";
import CustomerList from "../screens/ManagerScreens/CustomerInventrory";
import ManagerProfile from "../screens/ManagerScreens/ManagerProfile.jsx";
import Reports from "../screens/ManagerScreens/Reports";
import Header from "../components/Header.jsx";

const Tab = createBottomTabNavigator();

const ManagerBottomTab = () => (
  <View style={{ height: "100%" }}>
    <Header/>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
        tabBarIcon: ({ color, size }) => {
          const iconSize = size ?? 22;
          const iconsMap = {
            Home: <HomeIcon color={color} size={iconSize} />,
            Approvals: <ClipboardDocumentCheckIcon color={color} size={iconSize} />,
            Customers: <UserGroupIcon color={color} size={iconSize} />,
            Reports: <ChartBarIcon color={color} size={iconSize} />,
            ManagerProfile: <UserCircleIcon color={color} size={iconSize} />,
          };
          return iconsMap[route.name] || null;
        },
      })}
    >
      <Tab.Screen name="Home" component={ManagerHomeScreen} />
      <Tab.Screen name="Approvals" component={ApprovalRequests} />
      <Tab.Screen name="Customers" component={CustomerList} />
      <Tab.Screen name="Reports" component={Reports} />
      <Tab.Screen name="ManagerProfile" component={ManagerProfile} />
    </Tab.Navigator>
  </View>
);

export default ManagerBottomTab;
