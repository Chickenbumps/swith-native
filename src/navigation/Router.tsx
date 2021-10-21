import { useReactiveVar } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { isLoggedInVar } from "../apollo";
import LoggedInNav from "./LoggedInNav";
import LoggedOutNav from "./LoggedOutNav";

export type LoggedOutNavStackParamList = {
  Login: {
    email: string;
    password: string;
  };
  CreateAccount: undefined;
};

export type LoggedInNavStackParamList = {
  Tab: undefined;
  Home: {
    observers?: any[] | undefined;
  };
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
  Observer: undefined;
  Notification: undefined;
  SelectPhoto: undefined;
};

export default function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
    </NavigationContainer>
  );
}
