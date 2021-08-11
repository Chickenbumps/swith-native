import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "./DismissKeyboard";

export default function HomeLayout({ children }: any) {
  return (
    <DismissKeyboard>
      <Container>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.OS == "ios" ? 50 : 0}
        >
          {children}
        </KeyboardAvoidingView>
      </Container>
    </DismissKeyboard>
  );
}
const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  background-color: ${(props) => props.theme.bgColor};
`;
