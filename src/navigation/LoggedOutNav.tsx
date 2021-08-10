import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CreateAccount from "../screens/CreateAccount";
import Login from "../screens/Login";
import { colors } from "../styles";

export type LoggedOutNavStackParamList = {
  Welcome: undefined;
  Login: {
    username: string;
    password: string;
  };
  CreateAccount: undefined;
};
const Stack = createStackNavigator();

export default function LoggedOutNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "",
        headerTransparent: true,
        headerTintColor: `${colors.blue}`,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
}
