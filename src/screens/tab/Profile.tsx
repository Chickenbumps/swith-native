import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styled from "styled-components/native";
import useUser from "../../hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { screenXY, useSelectTheme } from "../../styles";

import CommentList from "../CommentList";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../../navigation/Router";
import ScreenLayout from "../../components/ScreenLayout";
import { reloadVar } from "../../apollo";

type ProfileScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "Profile"
>;

export default function Profile({ navigation, route }: ProfileScreenProps) {
  const theme = useSelectTheme();

  const { data: meData, loading: userLoading } = useUser();

  return (
    <ScreenLayout loading={userLoading} isKeyboard={false}>
      <SettingView>
        <SettingIcon onPress={() => navigation.navigate("EditProfile")}>
          <Ionicons name="cog-outline" size={28} color={theme.txtColor} />
        </SettingIcon>
      </SettingView>
      <UserInfo>
        {meData?.isMe.avatar ? (
          <Avatar
            source={{
              uri: meData.isMe.avatar,
            }}
          />
        ) : (
          <Avatar source={require("../../../assets/image/default.png")} />
        )}
        <Username>{meData?.isMe.username}</Username>
        <Bio>{meData?.isMe.bio}</Bio>
        <FollowWrapper>
          <FollowItem>
            <FollowText>팔로워</FollowText>

            <FollowText>{meData?.isMe.totalFollowers}</FollowText>
          </FollowItem>
          <FollowItem>
            <FollowText>팔로잉</FollowText>
            <FollowText>{meData?.isMe.totalFollowing}</FollowText>
          </FollowItem>
        </FollowWrapper>
      </UserInfo>
      <DailyBtnView>
        <DailyBtn onPress={() => navigation.navigate("DailyText")}>
          <DailyBtnText>일기 작성</DailyBtnText>

          <Ionicons name="create-outline" size={22} color={theme.txtColor} />
        </DailyBtn>
      </DailyBtnView>
      <CommentList
        id={meData?.isMe.id}
        username={meData?.isMe.username}
        avatar={meData?.isMe.avatar}
        isCreated={route?.params?.isCreated}
      />
    </ScreenLayout>
  );
}

const SettingView = styled.View`
  margin-right: 20px;
  margin-top: 5px;
  align-items: flex-end;
`;

const UserInfo = styled.View`
  align-items: center;
`;
const SettingIcon = styled.TouchableOpacity``;

const Avatar = styled.Image`
  height: 150px;
  width: 150px;
  border-radius: 75px;
`;

const Username = styled.Text`
  font-weight: bold;
  color: ${(props) => props.theme.txtColor};
  margin-top: 10px;
`;

const Bio = styled(Username)``;

const FollowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-top: 30px;
`;
const FollowItem = styled.View`
  justify-content: center;
  align-items: center;
`;
const FollowText = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;

const DailyBtnView = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const DailyBtn = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  margin: 20px 15px 0 0;
  color: ${(props) => props.theme.txtColor};
  font-weight: bold;
`;
const DailyBtnText = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
