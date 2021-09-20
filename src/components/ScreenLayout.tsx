import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors, useSelectTheme } from "../styles";

interface ScreenProps {
  loading: boolean;
  children: any;
  style?: StyleProp<ViewStyle>;
}

export default function ScreenLayout({
  loading,
  children,
  style,
}: ScreenProps) {
  const theme = useSelectTheme();
  return loading ? (
    <View
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          // backgroundColor: theme.bgColor,
        },
        style,
      ]}
    >
      <ActivityIndicator color={theme.txtColor} size="large" />
    </View>
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

const styles = StyleSheet.create({});
