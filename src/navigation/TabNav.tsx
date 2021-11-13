import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/tab/Home";
import Ranking from "../screens/tab/Ranking";
import Plan from "../screens/tab/Plan";
import GroupList from "../screens/tab/GroupList";
import Profile from "../screens/tab/Profile";
import { Ionicons } from "@expo/vector-icons";
import { useSelectTheme } from "../styles";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function TabNav() {
  const theme = useSelectTheme();
  const navigation = useNavigation<any>();
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
              style={{ width: 120, height: 30 }}
            />
          ),
          headerStyle: {
            shadowColor: "transparent",
          },
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={Ranking}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "medal" : "medal-outline"}
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
        name="GroupList"
        component={GroupList}
        options={{
          headerTitle: "나의 그룹 리스트",
          headerTintColor: theme.txtColor,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SearchGroup");
              }}
            >
              <Ionicons
                name="search-outline"
                size={28}
                style={{ marginLeft: 10 }}
                color={theme.txtColor}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CreateGroup");
              }}
            >
              <Ionicons
                name="add-outline"
                size={28}
                style={{ marginRight: 10 }}
                color={theme.txtColor}
              />
            </TouchableOpacity>
          ),
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
