import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        source={require("../../assets/62075-teen-walking.json")}
        autoPlay
        loop
      />
    </View>
  );
}
