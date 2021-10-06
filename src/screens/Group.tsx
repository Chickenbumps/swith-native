import {
  ApolloCache,
  FetchResult,
  gql,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import useUser from "../hooks/useUser";
import { LoggedInNavStackParamList } from "../navigation/Router";
import { useSelectTheme } from "../styles";
import {
  seeGroup,
  seeGroupVariables,
  seeGroup_seeGroup,
  seeGroup_seeGroup_messages,
} from "../__generated__/seeGroup";
import {
  sendMessage,
  sendMessageVariables,
} from "../__generated__/sendMessage";
import moment from "moment";
import { useLayoutEffect } from "react";

const SEE_GROUP_QUERY = gql`
  query seeGroup($id: Int!, $offset: Int!) {
    seeGroup(id: $id, offset: $offset) {
      id
      title
      description
      members {
        id
        username
        avatar
      }
      messages {
        id
        payload
        user {
          id
          username
          avatar
        }
        createdAt
        read
      }
      inviter {
        id
        user {
          id
          username
        }
      }
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($groupId: Int!, $payload: String!) {
    sendMessage(groupId: $groupId, payload: $payload) {
      ok
      id
      error
    }
  }
`;

const UPDATE_MESSAGE_SUBSCRIPTION = gql`
  subscription updateMessage($groupId: Int!) {
    updateMessage(groupId: $groupId) {
      id
      payload
      user {
        id
        username
        avatar
      }
      createdAt
      read
    }
  }
`;

type GroupScreenProps = StackScreenProps<LoggedInNavStackParamList, "Group">;
export default function Group({ route, navigation }: GroupScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const theme = useSelectTheme();
  const { data: meData } = useUser();
  const {
    data,
    error,
    refetch,
    subscribeToMore,
    fetchMore,
    loading: groupLoading,
  } = useQuery<seeGroup, seeGroupVariables>(SEE_GROUP_QUERY, {
    variables: {
      id: route.params.id,
      offset: 0,
    },
  });

  const { handleSubmit, watch, setValue, register, getValues } = useForm();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.seeGroup ? `${data?.seeGroup?.title}` : "그룹",
    });
  }, [data]);

  const client = useApolloClient();
  const subscriptionUpdate = (previousQueryResult: any, options: any): any => {
    const {
      subscriptionData: {
        data: { updateMessage: message },
      },
    } = options;
    // console.log(message);
    if (message.id) {
      const incomingMessage = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            createdAt
            read
          }
        `,
        data: message,
      });
      client.cache.modify({
        id: `Group:${route.params.id}`,
        fields: {
          messages(prev: seeGroup_seeGroup_messages[]) {
            const isExist = prev.find((item) => item.id === message.id);
            if (isExist) {
              return [...prev];
            }
            return [message, ...prev];
          },
        },
      });
    }
  };

  useEffect(() => {
    if (data?.seeGroup) {
      subscribeToMore({
        document: UPDATE_MESSAGE_SUBSCRIPTION,
        variables: {
          groupId: route?.params?.id,
        },
        updateQuery: subscriptionUpdate,
      });
    }
  }, [data]);

  const updateSendMessage = (
    cache: ApolloCache<any>,
    result: FetchResult<any>
  ) => {
    const {
      data: {
        sendMessage: { ok, id, error },
      },
    } = result;
    if (!ok) {
      throw new Error(`메시지 보내기 실패:${error}`);
    }
    const { message } = getValues();
    setValue("message", "");
    const messageObj = {
      id,
      payload: message,
      user: {
        username: meData?.isMe.username,
        avatar: meData?.isMe.avatar,
      },
      createdAt: moment().format(),
      read: true,
      __typename: "Message",
    };

    cache.modify({
      id: `Group:${route.params.id}`,
      fields: {
        messages(prev: seeGroup_seeGroup_messages[]) {
          const isExist = prev.find((item) => item.id === message.id);
          if (isExist) {
            return [...prev];
          }
          return [...prev, message];
        },
      },
    });
  };

  const [sendMessage, { loading: mutationLoading }] = useMutation<
    sendMessage,
    sendMessageVariables
  >(SEND_MESSAGE_MUTATION, {
    update: updateSendMessage,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await fetchMore({
      variables: {
        offset: data?.seeGroup?.messages?.length,
      },
    });
    setRefreshing(false);
  };

  const onValid = ({ message }: any) => {
    if (!mutationLoading) {
      sendMessage({
        variables: {
          groupId: route.params.id,
          payload: message,
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior="padding"
      keyboardVerticalOffset={90}
    >
      <ScreenLayout loading={groupLoading}>
        <FlatList
          inverted
          data={data?.seeGroup.messages}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReachedThreshold={1}
          scrollsToTop
          onEndReached={() =>
            fetchMore({
              variables: {
                offset: data?.seeGroup?.messages?.length,
              },
            })
          }
          refreshControl={
            <RefreshControl
              tintColor={theme.activeColor}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={({
            item: message,
          }: {
            item: seeGroup_seeGroup_messages;
          }) => {
            const time = message.createdAt.slice(11, 16);
            return (
              <MessageContainer
                isMine={message.user.username === route.params.username}
              >
                {message.user.username !== route.params.username ? (
                  <Avatar source={{ uri: message.user.avatar }} />
                ) : null}
                <Column>
                  {message.user.username !== route.params.username ? (
                    <Username>{message.user.username}</Username>
                  ) : null}
                  <MessageView
                    isMine={message.user.username === route.params.username}
                  >
                    <Message>{message.payload}</Message>
                  </MessageView>
                  <TimeVIew
                    isMine={message.user.username === route.params.username}
                  >
                    <Time>{time}</Time>
                  </TimeVIew>
                </Column>
              </MessageContainer>
            );
          }}
        />
        <InputContainer>
          <MessageInput
            {...register("message")}
            placeholder="메시지를 입력하세요."
            placeholderTextColor={theme.phColor}
            returnKeyLabel="메시지 보내기"
            returnKeyType="send"
            value={watch("message")}
            onChangeText={(text) => setValue("message", text)}
            onSubmitEditing={handleSubmit(onValid)}
            autoFocus
            autoCorrect={false}
          />
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}

const InputContainer = styled.View`
  width: 95%;
  margin-top: 25px;
  margin-bottom: 5px;
  align-items: center;
`;

const MessageInput = styled.TextInput`
  color: ${(props) => props.theme.txtColor};
  border: 2px solid ${(props) => props.theme.txtColor};
  border-radius: 1000px;
  width: 90%;
  height: 30px;
`;

interface MCprop {
  isMine: boolean;
}
const MessageContainer = styled.View<MCprop>`
  flex-direction: ${(props) => (props.isMine ? "row-reverse" : "row")};
  align-items: flex-start;
  padding: 15px;
`;
const UserInfo = styled.View``;
const Column = styled.View`
  flex-direction: column;
  margin-left: 10px;
`;
const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 10px;
`;
const Username = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-weight: 300;
`;

const MessageView = styled.View<MCprop>`
  border: 2px solid ${(props) => props.theme.txtColor};
  border-radius: 200px;
  border-top-right-radius: ${(props) => (props.isMine ? "0px" : "200px")};
  border-top-left-radius: ${(props) => (props.isMine ? "200px" : "0px")};
  padding: 5px 10px;
`;

const Message = styled.Text`
  font-size: 16px;
`;

const TimeVIew = styled.View<MCprop>`
  align-items: ${(props) => (props.isMine ? "flex-start" : "flex-end")};
`;

const Time = styled.Text`
  color: ${(props) => props.theme.phColor};
`;
