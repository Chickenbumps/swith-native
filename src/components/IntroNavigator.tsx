import React from "react";
import { StyleSheet, Text, View, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("screen");
export default function IntroNavigator({ data, scrollX }: any) {
  return (
    <View style={{ flexDirection: "row", height: 64 }}>
      {data.map((_: any, i: any) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, opacity }]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00B1D2",
    marginHorizontal: 8,
  },
});
