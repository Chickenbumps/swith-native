import { useReactiveVar } from "@apollo/client";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CreateAccount from "../screens/CreateAccount";
import Intro from "../screens/Intro";
import Login from "../screens/Login";
import { useSelectTheme } from "../styles";
import LoadingScreen from "../screens/LoadingScreen";
import { isLottieVar } from "../apollo";

const Stack = createStackNavigator();

export default function LoggedOutNav() {
  const theme = useSelectTheme();
  const isLottie = useReactiveVar(isLottieVar);
  // const [isLoading, setIsLoading] = useState(isLottie);
  const [viewedIntro, setViewedIntro] = useState<any>(null);
  let initialRoute: any = null;
  useEffect(() => {
    console.log(isLottie);
    AsyncStorage.getItem("@viewedIntro").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("@viewedIntro", "true");
        setViewedIntro(false);
      } else {
        setViewedIntro(true);
      }
      setInterval(() => {
        isLottieVar(false);
      }, 3000);
    });
  }, []);

  if (viewedIntro === null) {
    return null;
  } else if (viewedIntro !== true) {
    initialRoute = "Intro";
  } else {
    initialRoute = "Login";
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "",
        headerTransparent: true,
        headerTintColor: theme.txtColor,
        headerBackTitleVisible: false,
      }}
      initialRouteName={initialRoute}
    >
      {isLottie ? (
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ header: () => null }}
        />
      ) : (
        <Stack.Screen
          name="Intro"
          component={Intro}
          options={{ header: () => null }}
        />
      )}
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
