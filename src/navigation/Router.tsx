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
  Drawer: {
    id: number;
    username: string | undefined;
  };
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
  Ranking: undefined;
  GroupList: {
    isCreated: boolean;
  };
  Profile: undefined;
  EditProfile: undefined;
  Comment: undefined;
  CreateGroup: undefined;
  Group: {
    id: number;
    username: string | undefined;
  };
  Observer: undefined;
  Notification: undefined;
  SelectPhoto: undefined;
  UserProfile: {
    username: string;
  };
  SearchGroup: undefined;
  GroupInfo: {
    id: number;
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
