import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { logUserOut } from "../apollo";

export default function Home() {
  return (
    <View>
      <TouchableOpacity onPress={logUserOut}>
        <Text>loggout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
