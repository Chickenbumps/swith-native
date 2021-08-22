import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.txtColor};
  padding: 15px 10px;
  border-radius: 3px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  font-weight: 600;
  text-align: center;
`;

interface AuthButtonProps {
  onPress: () => any;
  disabled?: boolean;
  text: string;
  loading?: boolean;
}

export default function AuthButton({
  onPress,
  disabled,
  text,
  loading,
}: AuthButtonProps) {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {loading ? <ActivityIndicator /> : <ButtonText>{text}</ButtonText>}
    </Button>
  );
}
