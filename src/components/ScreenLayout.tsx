import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, useSelectTheme } from "../styles";

export default function ScreenLayout({ loading, children }: any) {
  const theme = useSelectTheme();
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.bgColor,
        flex: 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={theme.txtColor} size="large" />
      ) : (
        children
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
