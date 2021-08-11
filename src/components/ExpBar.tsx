import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import { screenXY, useSelectTheme } from "../styles";
const Progress = ({ step, steps }: any) => {
  const animatedValue = useRef(new Animated.Value(-1000)).current;
  const reactive = useRef(new Animated.Value(-1000)).current;
  const [width, setWidth] = useState(0);
  const theme = useSelectTheme();
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    reactive.setValue(-width + (width * step) / steps);
  }, [step, width]);
  return (
    <Container>
      <ProgressText>
        {step}/{steps}
      </ProgressText>
      <BarContainer
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;

          setWidth(newWidth);
        }}
      >
        <AnimatedLinearGradient
          colors={[theme.txtColor, "#9617FA"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1.5, y: 0.5 }}
          style={{
            height: 20,
            width: "100%",
            borderRadius: 10,

            position: "absolute",
            // left: 0,
            // top: 0,
            transform: [{ translateX: animatedValue }],
          }}
        ></AnimatedLinearGradient>
      </BarContainer>
    </Container>
  );
};
export default function ExpBar({ step, steps }: any) {
  return (
    <View>
      <Progress step={step} steps={steps} />
    </View>
  );
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const Container = styled.View`
  flex-direction: column;
  align-items: flex-end;
`;
const ProgressText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 4px;
  color: ${(props) => props.theme.txtColor};
  align-items: flex-end;
  justify-content: center;
`;

const BarContainer = styled.View`
  width: ${screenXY.width}px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
`;
