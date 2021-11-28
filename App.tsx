import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { ApolloProvider } from "@apollo/client";
import client, { isLoggedInVar, tokenVar } from "./src/apollo";
import Router from "./src/navigation/Router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./src/styles";
// import firebase from "firebase";
import "react-native-gesture-handler";
// import { firebaseConfig } from "./config/key";

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => {
    setLoading(false);
  };
  const preloadAsset = async () => {
    const fontsToLoad = [Ionicons.font];
    const FontCache = fontsToLoad.map((font) => Font.loadAsync(font));
    const images = [
      require("./assets/image/logo.png"),
      require("./assets/image/default.png"),
      require("./assets/image/undraw_Online_learning_blue.png"),
      require("./assets/image/undraw_Surveillance_blue.png"),
      require("./assets/image/undraw_connection_blue.png"),
      require("./assets/image/undraw_stepping_up_blue.png"),
    ];
    const ImageCache = images.map((image) => Asset.loadAsync(images));
    await Promise.all<any>([...FontCache, ...ImageCache]);
  };

  const preload = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }
    return preloadAsset();
  };

  if (loading) {
    return (
      <AppLoading
        startAsync={preload}
        onError={console.warn}
        onFinish={onFinish}
      />
    );
  }
  // if (firebase.apps.length === 0) {
  //   firebase.initializeApp(firebaseConfig);
  // } else {
  //   firebase.app();
  // }
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={lightTheme}>
        <StatusBar />
        <Router />
      </ThemeProvider>
    </ApolloProvider>
  );
}
