import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styled from "styled-components/native";
import { logUserOut } from "../../apollo";

import useUser from "../../hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { screenXY, useSelectTheme } from "../../styles";

import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import {
  createComment,
  createCommentVariables,
} from "../../__generated__/createComment";
import CommentList from "../CommentList";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../../navigation/Router";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($payload: String!) {
    createComment(payload: $payload) {
      ok
      error
    }
  }
`;

type ProfileScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "Profile"
>;

export default function Profile({ navigation }: ProfileScreenProps) {
  const theme = useSelectTheme();
  const { handleSubmit, register, setValue, getValues, watch } = useForm();
  const { data: userData, refetch } = useUser();
  const [createComment, { loading }] = useMutation<
    createComment,
    createCommentVariables
  >(CREATE_COMMENT_MUTATION, {
    onCompleted: (data) => {
      const {
        createComment: { ok, error },
      } = data;
      if (!ok) {
        Alert.alert(`${error}`);
        // throw new Error(`코멘트 작성에러:${error}`);
      }
    },
  });

  const onValid = (data: createCommentVariables) => {
    if (!loading) {
      createComment({
        variables: {
          payload: data.payload,
        },
      });
      setValue("payload", "");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.bgColor, flex: 1 }}>
      <SettingIcon onPress={() => navigation.navigate("EditProfile")}>
        <Ionicons name="cog-outline" size={24} color={theme.txtColor} />
      </SettingIcon>
      <UserInfo>
        {userData?.isMe.avatar ? (
          <Avatar
            source={{
              uri: userData.isMe.avatar,
            }}
          />
        ) : (
          <Avatar source={require("../../../assets/image/default.png")} />
        )}
        <Username>{userData?.isMe.username}</Username>
        <FollowWrapper>
          <FollowItem>
            <FollowText>팔로워</FollowText>
            <FollowText>2</FollowText>
          </FollowItem>
          <FollowItem>
            <FollowText>팔로잉</FollowText>
            <FollowText>3</FollowText>
          </FollowItem>
        </FollowWrapper>
      </UserInfo>
      <View style={{ alignItems: "center" }}>
        <DailyText
          {...register("payload")}
          value={watch("payload")}
          placeholder="   일기 작성하기 :)"
          placeholderTextColor={theme.txtColor}
          autoCapitalize="none"
          onChangeText={(text) => setValue("payload", text)}
          onSubmitEditing={handleSubmit(onValid)}
        />
      </View>

      <CommentList onPress={() => navigation.navigate("Comment")} />
    </SafeAreaView>
  );
}

const UserInfo = styled.View`
  align-items: center;
`;
const SettingIcon = styled.TouchableOpacity`
  margin-right: 20px;
  align-items: flex-end;
`;

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
const DailyText = styled.TextInput`
  width: ${screenXY.width}px;
  height: 30px;
  margin-top: 40px;
  border-radius: 9px;
  color: ${(props) => props.theme.txtColor};
  font-weight: bold;
  border: 2px solid ${(props) => props.theme.txtColor};
`;
