import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import CreateAccount from "../screens/CreateAccount";
import Login from "../screens/Login";
import { useSelectTheme } from "../styles";

const Stack = createStackNavigator();

export default function LoggedOutNav() {
  const theme = useSelectTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "",
        headerTransparent: true,
        headerTintColor: theme.txtColor,
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
