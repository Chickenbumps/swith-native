import { useReactiveVar } from "@apollo/client";
import React, { useState } from "react";
import { Text, TouchableOpacity, TouchableHighlight } from "react-native";
import styled from "styled-components/native";
import { logUserOut, modalVisibleVar } from "../apollo";
import CustomModal from "../components/CustomModal";
import ScreenLayout from "../components/ScreenLayout";
import useUser from "../hooks/useUser";

export default function EditProfile() {
  const { data: userData, loading } = useUser();
  const modalVisible = useReactiveVar(modalVisibleVar);
  const [editPart, setEditPart] = useState("name");

  return (
    <ScreenLayout loading={loading}>
      <CustomModal part={editPart} />

      <BasicInfo>
        <Avatar source={{ uri: userData?.isMe.avatar }} />
        <Username>{userData?.isMe.username}</Username>
        <Email>{userData?.isMe.email}</Email>
      </BasicInfo>

      <Index>개인 설정</Index>
      <UserSetting>
        <Wrapper>
          <Component>이름</Component>
          <TouchableHighlight
            onPress={() => {
              modalVisibleVar(true);
              setEditPart("name");
            }}
          >
            <Component>{userData?.isMe.name}</Component>
          </TouchableHighlight>
        </Wrapper>
        <Wrapper>
          <Component>소개</Component>
          <TouchableHighlight
            onPress={() => {
              modalVisibleVar(true);
              setEditPart("bio");
            }}
          >
            <Component>
              {userData?.isMe?.bio ? userData.isMe.bio : "반갑습니다"}
            </Component>
          </TouchableHighlight>
        </Wrapper>
        <Wrapper>
          <Component>감시자 설정</Component>
          <Component>미구현</Component>
        </Wrapper>
        <Wrapper>
          <Component>알림 설정</Component>
          <Component>미구현</Component>
        </Wrapper>
      </UserSetting>
      <Index>계정 설정</Index>
      <AccountSetting>
        <Wrapper>
          <TouchableOpacity onPress={() => logUserOut()}>
            <Component>로그 아웃</Component>
          </TouchableOpacity>
        </Wrapper>
      </AccountSetting>
    </ScreenLayout>
  );
}

const BasicInfo = styled.View`
  justify-content: center;
  align-items: center;
`;
const NormalText = styled.Text`
  font-size: 20px;
  color: ${(props) => props.theme.txtColor};
`;

const Avatar = styled.Image`
  height: 150px;
  width: 150px;
  border-radius: 75px;
`;
const Username = styled(NormalText)``;
const Email = styled(NormalText)``;

const UserSetting = styled.View`
  border: 1px solid ${(props) => props.theme.txtColor};
  border-radius: 10px;
  margin: 10px;
  background-color: ${(props) => props.theme.bgColor};
`;
const Component = styled.Text`
  color: ${(props) => props.theme.phColor};
  font-size: 16px;
`;
const Wrapper = styled.View`
  border-bottom-color: ${(props) => props.theme.txtColor};
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px;
`;

const Index = styled(Component)`
  margin-top: 10px;
  margin-left: 20px;
`;

const AccountSetting = styled(UserSetting)``;
