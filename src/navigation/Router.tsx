import { useReactiveVar } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { isLoggedInVar } from "../apollo";
import LoggedInNav from "./LoggedInNav";
import LoggedOutNav from "./LoggedOutNav";

export type LoggedOutNavStackParamList = {
  Login: {
    email?: string;
    password?: string;
  };
  Intro: undefined;
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
    isNavigated?: boolean;
  };
  CameraScreen: {
    second?: boolean;
  };
  Ranking: undefined;
  GroupList: {
    isCreated: boolean;
  };
  Profile: {
    isCreated: boolean;
  };
  EditProfile: undefined;
  Comment: {
    commentId: number;
    payload: string;
    username: string;
    avatar: any;
    range: string;
  };
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
  CommentList: undefined;
  DailyText: undefined;
};

export default function Router() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
    </NavigationContainer>
  );
}
