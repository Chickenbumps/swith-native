import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import styled from "styled-components/native";
import { screenXY, useSelectTheme } from "../styles";
import DismissKeyboard from "./DismissKeyboard";

const { width, height } = Dimensions.get("window");
export default function HomeLayout({ children, color, loading }: any) {
  const theme = useSelectTheme();
  return (
    <ScrollView
      style={{
        backgroundColor: theme.bgColor,
      }}
      contentContainerStyle={{
        backgroundColor: theme.bgColor,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <DismissKeyboard>
        <Container color={color}>
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={Platform.OS == "ios" ? 50 : 0}
          >
            {loading ? (
              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  backgroundColor: theme.bgColor,
                }}
              >
                <ActivityIndicator color={theme.txtColor} size="large" />
              </View>
            ) : (
              children
            )}
          </KeyboardAvoidingView>
        </Container>
      </DismissKeyboard>
    </ScrollView>
  );
}

interface ContainerProps {
  color: boolean;
}
const Container = styled.View<ContainerProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.color ? props.theme.bgColor : "#f1f3f5"};
`;
