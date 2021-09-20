import React, { useEffect } from "react";
import {
  Easing,
  TextInput,
  Animated,
  Text,
  View,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";

import Svg, { G, Circle } from "react-native-svg";
import { useSelectTheme } from "../styles";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
interface MedalProps {
  percent?: number;
  radius?: number;
  strokeWidth?: number;
  duration?: number;
  color?: string;
  delay?: number;
  textColor?: string;
  max?: number;
}

function MedalComponent({
  percent = 70,
  radius = 50,
  strokeWidth = 10,
  duration = 500,
  color,
  delay = 1000,
  textColor,
  max = 100,
}: MedalProps) {
  const animated = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef<any>();

  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const animation = (toValue: any) => {
    return Animated.timing(animated, {
      delay,
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  useEffect(() => {
    animation(percent);
    animated.addListener((v) => {
      if (circleRef?.current) {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset =
          circumference - (circumference * maxPerc) / 100;

        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
    return () => {
      animated.removeAllListeners();
    };
  });

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDashoffset={circumference}
            strokeDasharray={circumference}
          />
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeOpacity={0.2}
          />
        </G>
      </Svg>
    </View>
  );
}

export default function Medal({ maxExp, exp }: any) {
  const theme = useSelectTheme();
  return (
    <MedalComponent color={theme.activeColor} max={maxExp} percent={exp} />
  );
}
