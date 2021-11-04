import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { colors, useSelectTheme } from "../styles";
import DismissKeyboard from "./DismissKeyboard";

interface ScreenProps {
  loading: boolean;
  children: any;
  style?: StyleProp<ViewStyle>;
  isKeyboard: boolean;
}

export default function ScreenLayout({
  loading,
  children,
  style,
  isKeyboard,
}: ScreenProps) {
  const theme = useSelectTheme();
  return loading ? (
    <View
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          backgroundColor: theme.bgColor,
        },
        style,
      ]}
    >
      <ActivityIndicator color={theme.txtColor} size="large" />
    </View>
  ) : isKeyboard ? (
    <DismissKeyboard>
      <SafeAreaView
        style={{
          backgroundColor: theme.bgColor,
          flex: 1,
        }}
      >
        {children}
      </SafeAreaView>
    </DismissKeyboard>
  ) : (
    <SafeAreaView
      style={{
        backgroundColor: theme.bgColor,
        flex: 1,
      }}
    >
      {children}
    </SafeAreaView>
  );
}
