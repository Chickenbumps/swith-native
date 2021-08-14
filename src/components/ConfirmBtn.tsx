import React from "react";
import styled from "styled-components/native";

const Container = styled.View`
  margin-top: 40px;
  align-items: center;
`;
const Button = styled.TouchableOpacity``;
const BtnView = styled.View`
  flex-direction: row;
  width: 100px;
  height: 40px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.txtColor};
  align-items: center;
  justify-content: center;
`;
const BtnText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.bgColor};
`;

export default function ConfirmBtn({ onPress }: any) {
  return (
    <Container>
      <Button onPress={onPress}>
        <BtnView>
          <BtnText>확인</BtnText>
        </BtnView>
      </Button>
    </Container>
  );
}
