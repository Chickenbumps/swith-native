import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { useSelectTheme } from "../styles";
import DismissKeyboard from "./DismissKeyboard";

export default function HomeLayout({ children, color, loading }: any) {
  const theme = useSelectTheme();
  return (
    <DismissKeyboard>
      <Container color={color}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.OS == "ios" ? 50 : 0}
        >
          {loading ? (
            <ActivityIndicator color={theme.txtColor} size="large" />
          ) : (
            children
          )}
        </KeyboardAvoidingView>
      </Container>
    </DismissKeyboard>
  );
}

interface ContainerProps {
  color: boolean;
}
const Container = styled.View<ContainerProps>`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  background-color: ${(props) =>
    props.color ? props.theme.bgColor : "#f1f3f5"};
`;
