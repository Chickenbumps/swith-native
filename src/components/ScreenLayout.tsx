import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, useSelectTheme } from "../styles";

export default function ScreenLayout({ loading, children }: any) {
  const theme = useSelectTheme();
  return (
    <View
      style={{
        backgroundColor: theme.bgColor,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? <ActivityIndicator color={theme.txtColor} /> : children}
    </View>
  );
}

const styles = StyleSheet.create({});
