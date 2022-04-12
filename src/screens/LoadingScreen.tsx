import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
const LottieView = require("lottie-react-native");

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        source={require("../../assets/73479-student.json")}
        autoPlay
        loop
      />
    </View>
  );
}
