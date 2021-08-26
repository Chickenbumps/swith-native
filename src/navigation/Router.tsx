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
    second?: boolean;
  };
  Result: {
    duration: number;
  };
  CameraScreen: {
    second?: boolean;
  };
  Analytics: undefined;
  GroupList: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Comment: undefined;
  CreateGroup: undefined;
  Group: {
    id: number;
    username: string;
  };
};

export default function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
    </NavigationContainer>
  );
}
