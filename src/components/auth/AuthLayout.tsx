import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../DismissKeyboard";

export default function AuthLayout({ children }: any) {
  return (
    <DismissKeyboard>
      <Container>
        <KeyboardAvoidingView
          style={{
            width: "100%",
          }}
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

  background-color: ${(props) => props.theme.white};
  padding: 200px 30px;
`;
