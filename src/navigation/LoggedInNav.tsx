import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Camera from "../screens/Camera";
import Result from "../screens/Result";
import Home from "../screens/tab/Home";
import TabNav from "./TabNav";

const Stack = createStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        component={TabNav}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Result"
        component={Result}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={Camera}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
