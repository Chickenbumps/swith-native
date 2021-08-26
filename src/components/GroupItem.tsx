import React from "react";
import { GestureResponderEvent } from "react-native";
import styled from "styled-components/native";
import { seeGroups_seeGroups_members } from "../__generated__/seeGroups";

interface groupItemProps {
  title: string;
  description: string | null;
  members: seeGroups_seeGroups_members[];
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  unreadMessage: number;
}

export default function GroupItem({
  title,
  description,
  members,
  onPress,
  unreadMessage,
}: groupItemProps) {
  return (
    <Container onPress={onPress}>
      <Column>
        <GroupTitle>{title}</GroupTitle>
        <GroupDesc>{description}</GroupDesc>
      </Column>
      <Column>
        <UnreadMessage>{unreadMessage}</UnreadMessage>
        <MemberNum>{members.length}명</MemberNum>
      </Column>
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgColor};
  padding: 20px 15px;
`;

const Column = styled.View`
  flex-direction: column;
`;
const MemberNum = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
const UnreadMessage = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;

const GroupTitle = styled.Text`
  color: ${(props) => props.theme.activeColor};
  font-size: 18px;
`;

const GroupDesc = styled.Text`
  color: ${(props) => props.theme.phColor};
`;
