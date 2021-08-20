import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/tab/Home";
import Analytics from "../screens/tab/Analytics";
import Plan from "../screens/tab/Plan";
import Group from "../screens/tab/Group";
import Profile from "../screens/tab/Profile";
import { Ionicons } from "@expo/vector-icons";
import { useSelectTheme } from "../styles";

const Tab = createBottomTabNavigator();

export default function TabNav() {
  const theme = useSelectTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.txtColor,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={theme.txtColor}
            />
          ),
          headerTitle: () => (
            <Image
              source={require("../../assets/image/logo.png")}
              style={{ width: 100, height: 30 }}
            />
          ),
          headerStyle: {
            shadowColor: "transparent",
          },
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={24}
              color={theme.txtColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Plan"
        component={Plan}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "stopwatch" : "stopwatch-outline"}
              size={28}
              color={theme.txtColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Group"
        component={Group}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={28}
              color={theme.txtColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={theme.txtColor}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
