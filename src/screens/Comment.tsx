import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";
import useUser from "../hooks/useUser";
import { LoggedInNavStackParamList } from "../navigation/Router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, gql, ApolloCache, FetchResult } from "@apollo/client";
import { useNavigation } from "@react-navigation/core";
import {
  editComment,
  editCommentVariables,
} from "../__generated__/editComment";
import { useForm } from "react-hook-form";
import { useSelectTheme } from "../styles";
import { resultKeyNameFromField } from "@apollo/client/utilities";
type CommentScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "Comment"
>;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

const EDIT_COMMENT_MUTATION = gql`
  mutation editComment($id: Int!, $payload: String!, $range: String!) {
    editComment(id: $id, payload: $payload, range: $range) {
      ok
      error
    }
  }
`;

export default function Comment({ route, navigation }: CommentScreenProps) {
  const theme = useSelectTheme();
  const { data: meData, refetch } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [rangeValue, setRangeValue] = useState(route.params?.range);
  const { handleSubmit, register, setValue, getValues, watch } = useForm();
  const [deleteComment, { loading: mutaionLoading }] = useMutation(
    DELETE_COMMENT_MUTATION,
    {
      update: (cache: ApolloCache<any>, updateResult: FetchResult<any>) => {
        const {
          data: {
            deleteComment: { ok, error },
          },
        } = updateResult;
        console.log(error);
        if (!ok) {
          throw new Error(`코멘트 삭제에러:${error}`);
        }
        const comment = {
          __ref: `Comment:${route?.params?.commentId}`,
        };
        cache.modify({
          id: `ROOT_QUERY`,
          fields: {
            seeComments(prev) {
              return prev.filter((item: any) => item.__ref !== comment.__ref);
            },
          },
        });
        Alert.alert("삭제 완료했습니다.", "", [
          {
            text: "확인",
            onPress: () => navigation.navigate("Profile", { isCreated: true }),
          },
        ]);
      },
    }
  );
  const [editComment] = useMutation<editComment, editCommentVariables>(
    EDIT_COMMENT_MUTATION,
    {
      update: (cache: any, result: any) => {
        const {
          data: {
            editComment: { ok, error },
          },
        } = result;
        console.log(ok);
        console.log(error);

        if (ok) {
          navigation.navigate("Profile", { isCreated: true });

          cache.modify({
            id: `Comment:${route.params?.commentId}`,
            fields: {
              payload(prev: any) {
                return watch("payload");
              },
              range(prev: any) {
                return rangeValue;
              },
              updatedAt(prev: any) {
                return moment().format();
              },
            },
          });
        } else {
          Alert.alert("내용을 입력해주세요.", "", [
            {
              text: "확인",
              onPress: () =>
                navigation.navigate("Profile", { isCreated: true }),
            },
          ]);
        }
      },
    }
  );

  useLayoutEffect(() => {
    console.log(watch("payload"));
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerLeft: () => (
        <HeaderLeftBtn
          onPress={() => {
            setEditMode(false);
            navigation.goBack();
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            size={28}
            color={theme.txtColor}
          />
        </HeaderLeftBtn>
      ),
      headerRight: () =>
        route?.params?.username === meData?.isMe.username ? (
          <HeaderRightView>
            {!editMode ? (
              <EditBtn onPress={() => setEditMode(!editMode)}>
                <EditText>편집</EditText>
              </EditBtn>
            ) : (
              <EditBtn
                onPress={() => {
                  Alert.alert("편집을 완료하시겠습니까?", "", [
                    {
                      text: "아니요",
                      onPress: () => {
                        setEditMode(!editMode);
                        setValue("payload", route.params?.payload);
                      },
                    },
                    {
                      text: "예",
                      onPress: () => {
                        editComment({
                          variables: {
                            id: route.params?.commentId,
                            payload: watch("payload"),
                            range: rangeValue,
                          },
                        });
                      },
                    },
                  ]);
                }}
              >
                <EditText>완료</EditText>
              </EditBtn>
            )}
            <DeleteBtn
              onPress={() => onDeleteComment(route?.params?.commentId)}
            >
              <Ionicons name="trash-outline" size={22} color="tomato" />
            </DeleteBtn>
          </HeaderRightView>
        ) : null,
    });
  }, [editMode, rangeValue, register, watch("payload")]);

  useEffect(() => {
    register("payload", { value: route.params?.payload });
  }, [register]);

  const onDeleteComment = (id: any) => {
    if (!mutaionLoading) {
      Alert.alert("정말 삭제하시겠습니까?", "", [
        {
          text: "예",
          onPress: () =>
            deleteComment({
              variables: {
                id,
              },
            }),
        },
        {
          text: "아니요",
        },
      ]);
    }
  };

  return (
    <Container>
      <AuthorView>
        <AuthorNavView>
          <AuthorNavText>작성자</AuthorNavText>
        </AuthorNavView>
        <AuthorInfoView>
          <UserView>
            <UserAvatar source={{ uri: route.params?.avatar }} />
            <Username>{route.params?.username}</Username>
          </UserView>
          <DateTime>{moment().format("YYYY-MM-DD")}</DateTime>
        </AuthorInfoView>
      </AuthorView>
      <RangeLimitView>
        <RangeNavView>
          <RangeNavText>공개 범위</RangeNavText>
        </RangeNavView>
        {!editMode ? (
          <RangeView>
            <Range range={route.params?.range} isSelected={true}>
              <RangeText range={route.params?.range} isSelected={true}>
                {route?.params?.range}
              </RangeText>
            </Range>
          </RangeView>
        ) : (
          <RangeEditView>
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
              <RangeText isSelected={rangeValue === "Private"}>
                Private
              </RangeText>
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
          </RangeEditView>
        )}
      </RangeLimitView>
      <DailyTextView>
        <DailyNavView>
          <DailyNavText>내용</DailyNavText>
        </DailyNavView>
        <ContentView>
          {editMode ? (
            <ContentTextInput
              placeholder="오늘 하루는 어떠셨나요? 기록으로 남겨보세요:)"
              ref={register("payload").ref}
              value={watch("payload")}
              autoCapitalize="none"
              onChangeText={(text) => setValue("payload", text)}
              autoCorrect={false}
              multiline={true}
              textAlignVertical="top"
              maxLength={900}
              autoCompleteType="off"
            />
          ) : (
            <ContentText>{route.params?.payload}</ContentText>
          )}
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
const Username = styled.Text`
  margin-left: 10px;
`;
const DateTime = styled.Text`
  margin-right: 10px;
`;

const RangeLimitView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  /* justify-content: flex-start; */
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
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 20px;
`;

const RangeEditView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 20px;
`;

interface RangeProps {
  isSelected?: boolean;
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

const DailyTextView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  margin-top: 10px;
  padding: 10px 0 10px 20px;
`;

const DailyNavView = styled(AuthorNavView)``;
const DailyNavText = styled(AuthorNavText)``;

const ContentView = styled.View``;

const ContentText = styled.Text``;

const ContentTextInput = styled.TextInput``;

const HeaderRightView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DeleteBtn = styled.TouchableOpacity`
  margin-right: 10px;
`;
const EditBtn = styled.TouchableOpacity`
  margin-right: 30px;
`;
const EditText = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;

const HeaderLeftBtn = styled.TouchableOpacity``;
