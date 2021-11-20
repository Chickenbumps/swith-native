import { useMutation, gql, ApolloCache, FetchResult } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";
import { reloadVar } from "../apollo";
import useUser from "../hooks/useUser";
import { LoggedInNavStackParamList } from "../navigation/Router";
import { screenXY, useSelectTheme } from "../styles";

import {
  createComment,
  createCommentVariables,
} from "../__generated__/createComment";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($payload: String!, $range: String!) {
    createComment(payload: $payload, range: $range) {
      ok
      commentId
      error
    }
  }
`;
const { width, height } = Dimensions.get("screen");
type DailyTextProps = StackScreenProps<LoggedInNavStackParamList, "DailyText">;

export default function DailyText({ navigation }: DailyTextProps) {
  const { data: meData } = useUser();
  const theme = useSelectTheme();
  const [rangeValue, setRangeValue] = useState("Public");

  const { handleSubmit, register, setValue, getValues, watch } = useForm();
  const [createComment, { loading }] = useMutation<
    createComment,
    createCommentVariables
  >(CREATE_COMMENT_MUTATION, {
    update: (cache: ApolloCache<any>, result: FetchResult<any>) => {
      const {
        data: {
          createComment: { ok, commentId, error },
        },
      } = result;
      console.log(result.data);
      const { payload } = getValues();
      if (!ok) {
        Alert.alert(`${error}`);
        // throw new Error(`코멘트 작성에러:${error}`);
      } else if (ok) {
        reloadVar(true);
        navigation.navigate("Profile", { isCreated: true });
        const commentObj = {
          id: commentId,
          __typename: "Comment",
          payload: payload,
          user: {
            __typename: "User",
            username: meData?.isMe.username,
            avatar: meData?.isMe.avatar,
          },
          isMine: true,
          createdAt: moment().format(),
          updatedAt: moment().format(),
          range: rangeValue,
        };
        const incomingComment = cache.writeFragment({
          fragment: gql`
            fragment NewMessage on Comment {
              id
              payload
              user {
                username
                avatar
              }
              isMine
              createdAt
              updatedAt
              range
            }
          `,
          data: commentObj,
        });
        cache.modify({
          id: `ROOT_QUERY`,
          fields: {
            seeComments(prev) {
              return [incomingComment, ...prev];
            },
          },
        });
        setValue("payload", "");
      }
    },
  });

  const onValid = () => {
    const { payload } = getValues();
    console.log(payload);
    console.log(rangeValue);
    if (!loading) {
      Alert.alert("작성을 완료하시겠습니까?", "", [
        {
          text: "아니요",
        },
        {
          text: "예",
          onPress: () => {
            createComment({
              variables: {
                payload: payload,
                range: rangeValue,
              },
            });
          },
        },
      ]);
    }
  };

  useEffect(() => {
    setRangeValue(rangeValue);
    navigation.setOptions({
      headerRight: () => (
        <ConfirmBtn onPress={() => onValid()}>
          <ConfirmBtnText>완료</ConfirmBtnText>
        </ConfirmBtn>
      ),
    });
  }, [navigation, rangeValue]);

  return (
    <Container>
      <AuthorView>
        <AuthorNavView>
          <AuthorNavText>작성자</AuthorNavText>
        </AuthorNavView>
        <AuthorInfoView>
          <UserView>
            <UserAvatar source={{ uri: meData?.isMe.avatar }} />
            <Username>{meData?.isMe.username}</Username>
          </UserView>
          <DateTime>{moment().format("YYYY-MM-DD")}</DateTime>
        </AuthorInfoView>
      </AuthorView>
      <RangeLimitView>
        <RangeNavView>
          <RangeNavText>공개 범위</RangeNavText>
        </RangeNavView>
        <RangeView>
          <Range
            isSelected={rangeValue === "Public"}
            range={rangeValue}
            onPress={() => setRangeValue("Public")}
          >
            <RangeText isSelected={rangeValue === "Public"}>Public</RangeText>
          </Range>
          <Range
            isSelected={rangeValue === "Private"}
            range={rangeValue}
            onPress={() => setRangeValue("Private")}
          >
            <RangeText isSelected={rangeValue === "Private"}>Private</RangeText>
          </Range>
          <Range
            isSelected={rangeValue === "Follower"}
            range={rangeValue}
            onPress={() => setRangeValue("Follower")}
          >
            <RangeText isSelected={rangeValue === "Follower"}>
              Follower
            </RangeText>
          </Range>
        </RangeView>
      </RangeLimitView>

      <DailyTextView>
        <DailyNavView>
          <DailyNavText>내용</DailyNavText>
        </DailyNavView>
        <ContentView>
          <ContentTextInput
            placeholder="오늘 하루는 어떠셨나요? 기록으로 남겨보세요:)"
            ref={register("payload").ref}
            value={watch("payload")}
            placeholderTextColor={theme.txtColor}
            autoCapitalize="none"
            onChangeText={(text) => setValue("payload", text)}
            autoCorrect={false}
            multiline={true}
            textAlignVertical="top"
            maxLength={900}
            autoCompleteType="off"
          />
        </ContentView>
      </DailyTextView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
`;
const AuthorNavView = styled.View`
  border-bottom-color: #f1f3f5;
  border-bottom-width: 1px;
  margin-bottom: 10px;
  padding-bottom: 10px;
`;
const AuthorNavText = styled.Text``;
const AuthorView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 0 10px 20px;
`;
const AuthorInfoView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const UserView = styled.View`
  flex-direction: row;
  align-items: center;
`;
const UserAvatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 75px;
`;
const Username = styled.Text``;

const DateTime = styled.Text`
  margin-right: 10px;
`;

const DailyTextView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  margin-top: 10px;
  padding: 10px 0 10px 20px;
`;

const RangeLimitView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  margin-top: 10px;
`;

const RangeNavView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  border-bottom-color: #f1f3f5;
  border-bottom-width: 1px;
  padding: 10px 0;
`;
const RangeNavText = styled.Text`
  font-size: 16px;
  margin-left: 20px;
`;

const RangeView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 20px;
`;

interface RangeProps {
  isSelected: boolean;
  range?: string;
}

const Range = styled.TouchableOpacity<RangeProps>`
  border: 1px solid ${(props) => props.theme.txtColor};
  background-color: ${(props) =>
    props.isSelected
      ? props.range === "Public"
        ? props.theme.activeColor
        : props.range === "Private"
        ? "tomato"
        : props.range === "Follower"
        ? props.theme.txtColor
        : "white"
      : "white"};
  border-radius: 10px;
  width: 60px;
  align-items: center;
  justify-content: center;
`;

const RangeText = styled.Text<RangeProps>`
  color: ${(props) => (props.isSelected ? "white" : props.theme.txtColor)};
`;

const DailyNavView = styled(AuthorNavView)``;
const DailyNavText = styled(AuthorNavText)``;

const ContentView = styled.View`
  width: ${width - 40}px;
  height: ${height - 40}px;
`;

const ContentTextInput = styled.TextInput``;

const ConfirmBtn = styled.TouchableOpacity`
  padding: 10px;
`;

const ConfirmBtnText = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
