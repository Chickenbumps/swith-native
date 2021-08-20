import { useReactiveVar } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { isLoggedInVar } from "../apollo";
import LoggedInNav from "./LoggedInNav";
import LoggedOutNav from "./LoggedOutNav";

export type LoggedOutNavStackParamList = {
  Login: {
    username: string;
    password: string;
  };
  CreateAccount: undefined;
};

export type LoggedInNavStackParamList = {
  Home: undefined;
  Plan: {
    faceDetected: boolean;
  };
  Result: {
    duration: number;
  };
  CameraScreen: undefined;
  Analytics: undefined;
  Group: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Comment: undefined;
};

export default function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
    </NavigationContainer>
  );
}
