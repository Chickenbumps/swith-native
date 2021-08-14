import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { logUserOut } from "../../apollo";
import ScreenLayout from "../../components/ScreenLayout";

export default function Profile() {
  return (
    <ScreenLayout>
      <TouchableOpacity onPress={logUserOut}>
        <Text>logout</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({});
