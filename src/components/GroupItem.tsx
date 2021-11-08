import React from "react";
import { GestureResponderEvent } from "react-native";
import styled from "styled-components/native";
import { seeGroups_seeGroups_members } from "../__generated__/seeGroups";

interface groupItemProps {
  title: string;
  description?: string | null;
  memberNum: number | null;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  unreadMessage?: number | null;
  groupAvatar: string | null;
}

export default function GroupItem({
  title,
  description,
  memberNum,
  onPress,
  unreadMessage,
  groupAvatar,
}: groupItemProps) {
  return (
    <Container onPress={onPress}>
      <GroupInfo>
        {groupAvatar ? (
          <GroupAvatarView>
            <GroupAvatar source={{ uri: groupAvatar }} />
          </GroupAvatarView>
        ) : null}
        <Column>
          <GroupTitle>{title}</GroupTitle>
          {description ? <GroupDesc>{description}</GroupDesc> : null}
        </Column>
      </GroupInfo>
      <Column>
        {unreadMessage ? <UnreadMessage>{unreadMessage}</UnreadMessage> : null}
        <MemberNum>{memberNum}명</MemberNum>
      </Column>
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  /* align-self: center; */
  flex-direction: row;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 10px;
`;

const GroupInfo = styled.View`
  flex-direction: row;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: center;
  padding-left: 5px;
`;

const MemberNum = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
const UnreadMessage = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
const GroupAvatarView = styled.View`
  border: 1px solid ${(props) => props.theme.txtColor};
  border-radius: 25px;
`;
const GroupAvatar = styled.Image`
  border-radius: 25px;
  width: 50px;
  height: 50px;
`;
const GroupTitle = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-size: 18px;
`;

const GroupDesc = styled.Text`
  color: ${(props) => props.theme.phColor};
`;
