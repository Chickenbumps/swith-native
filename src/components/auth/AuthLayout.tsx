import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../styles";

export default function AuthLayout({ children }: any) {
  return (
    <Container>
      <KeyboardAvoidingView
        style={{
          width: "100%",
        }}
        behavior="position"
        keyboardVerticalOffset={Platform.OS == "ios" ? 50 : 0}
      >
        <Logo
          resizeMode="contain"
          source={require("../../../assets/image/logo.png")}
        />
        {children}
      </KeyboardAvoidingView>
    </Container>
  );
}
const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.blue};
  padding: 0px 20px;
`;

const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  margin-bottom: 20px;
`;
