import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { useSelectTheme } from "../styles";
import DismissKeyboard from "./DismissKeyboard";

export default function HomeLayout({ children }: any) {
  const theme = useSelectTheme();
  return (
    <DismissKeyboard>
      <Container>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.OS == "ios" ? 50 : 0}
        >
          {children.loading ? (
            <ActivityIndicator color={theme.txtColor} size="large" />
          ) : (
            children
          )}
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
