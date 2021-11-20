import React, { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import useUser from "../hooks/useUser";
import {
  seeComments,
  seeCommentsVariables,
} from "../__generated__/seeComments";
import { useSelectTheme } from "../styles";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { reloadVar } from "../apollo";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../navigation/Router";
import { useNavigation } from "@react-navigation/core";
import { seeProfile, seeProfileVariables } from "../__generated__/seeProfile";

const SPACE = 12;

const ITEM_WIDTH = 168;
const ITEM_HEIGHT = ITEM_WIDTH * 1.2;
const FULL_SIZE = ITEM_WIDTH + SPACE * 2;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      username
      avatar
      bio
      totalFollowers
      totalFollowing
      isFollowing
      comments {
        id
        payload
        createdAt
        updatedAt
      }
    }
  }
`;

const SEE_COMMENTS_QUERY = gql`
  query seeComments($userId: Int!, $offset: Int!) {
    seeComments(userId: $userId, offset: $offset) {
      id
      payload
      user {
        avatar
        username
      }
      isMine
      createdAt
      updatedAt
      range
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

interface CommentListProps {
  id: any;
  username: any;
  avatar: any;
  isCreated?: boolean | undefined;
}

export default function CommentList({
  id,
  username,
  avatar,
  isCreated,
}: CommentListProps) {
  const navigation = useNavigation<any>();
  const theme = useSelectTheme();
  const { data: meData } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const { data: seeProfileData } = useQuery<seeProfile, seeProfileVariables>(
    SEE_PROFILE_QUERY,
    {
      variables: {
        username,
      },
    }
  );

  const [deleteComment, { loading: mutaionLoading }] = useMutation(
    DELETE_COMMENT_MUTATION,
    {
      onCompleted: (data) => {
        const {
          deleteComment: { ok, error },
        } = data;
        console.log(error);
        if (!ok) {
          throw new Error(`코멘트 삭제에러:${error}`);
        }
        Alert.alert("삭제 완료했습니다.");
        refetch();
      },
    }
  );
  const { data, error, fetchMore, refetch, loading } = useQuery<
    seeComments,
    seeCommentsVariables
  >(SEE_COMMENTS_QUERY, {
    variables: {
      userId: id,
      offset: 0,
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const onDeleteComment = (id: number) => {
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

  const reload = useReactiveVar(reloadVar);
  useEffect(() => {
    refetch();
    console.log("reloaded");
  }, [reload, isCreated]);

  return loading ? (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: theme.bgColor,
      }}
    >
      <ActivityIndicator color={theme.txtColor} size="large" />
    </View>
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl
          tintColor={theme.activeColor}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <Animated.FlatList
        data={data?.seeComments}
        keyExtractor={(item, index) => item.id.toString() + index}
        horizontal
        snapToInterval={FULL_SIZE}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.05}
        refreshing={refreshing}
        onRefresh={onRefresh}
        refreshControl={
          <RefreshControl
            tintColor={theme.activeColor}
            refreshing={refreshing}
          />
        }
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeComments?.length,
            },
          })
        }
        renderItem={({ item, index }) => {
          const year = item.updatedAt.slice(0, 4);
          const month = item.updatedAt.slice(5, 7);
          const day = item.updatedAt.slice(8, 10);
          const isFollow = seeProfileData?.seeProfile.isFollowing;

          return item.isMine && item.range === "Private" ? (
            <Container>
              <InnerContainer>
                <UserInfo>
                  {meData?.isMe.avatar ? (
                    <Avatar
                      source={{
                        uri: avatar,
                      }}
                    />
                  ) : null}
                  <Username>{username}</Username>
                </UserInfo>
                <MoreButton
                  onPress={() =>
                    navigation.navigate("Comment", {
                      commentId: item.id,
                      payload: item.payload,
                      avatar: avatar,
                      username: username,
                      range: item.range,
                    })
                  }
                >
                  <MoreText>더보기</MoreText>
                </MoreButton>
              </InnerContainer>
              <Payload>{item.payload}</Payload>

              <BottomContainer>
                <DayText>{`${year}년${month}월${day}일`}</DayText>
                <RangeView range={item.range}>
                  <RangeText range={item.range}>{item.range[0]}</RangeText>
                </RangeView>
                {meData?.isMe.id === id ? (
                  <DeleteButton onPress={() => onDeleteComment(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="tomato" />
                  </DeleteButton>
                ) : null}
              </BottomContainer>
            </Container>
          ) : isFollow && item.range === "Follower" ? (
            <Container>
              <InnerContainer>
                <UserInfo>
                  {meData?.isMe.avatar ? (
                    <Avatar
                      source={{
                        uri: avatar,
                      }}
                    />
                  ) : null}
                  <Username>{username}</Username>
                </UserInfo>
                <MoreButton
                  onPress={() =>
                    navigation.navigate("Comment", {
                      commentId: item.id,
                      payload: item.payload,
                      avatar: avatar,
                      username: username,
                      range: item.range,
                    })
                  }
                >
                  <MoreText>더보기</MoreText>
                </MoreButton>
              </InnerContainer>
              <Payload>{item.payload}</Payload>

              <BottomContainer>
                <DayText>{`${year}년${month}월${day}일`}</DayText>
                <RangeView range={item.range}>
                  <RangeText range={item.range}>{item.range[0]}</RangeText>
                </RangeView>
                {meData?.isMe.id === id ? (
                  <DeleteButton onPress={() => onDeleteComment(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="tomato" />
                  </DeleteButton>
                ) : null}
              </BottomContainer>
            </Container>
          ) : item.range == "Public" ? (
            <Container>
              <InnerContainer>
                <UserInfo>
                  {meData?.isMe.avatar ? (
                    <Avatar
                      source={{
                        uri: avatar,
                      }}
                    />
                  ) : null}
                  <Username>{username}</Username>
                </UserInfo>
                <MoreButton
                  onPress={() =>
                    navigation.navigate("Comment", {
                      commentId: item.id,
                      payload: item.payload,
                      avatar: avatar,
                      username: username,
                      range: item.range,
                    })
                  }
                >
                  <MoreText>더보기</MoreText>
                </MoreButton>
              </InnerContainer>
              <Payload>{item.payload}</Payload>

              <BottomContainer>
                <DayText>{`${year}년${month}월${day}일`}</DayText>
                <RangeView range={item.range}>
                  <RangeText range={item.range}>{item.range[0]}</RangeText>
                </RangeView>
                {meData?.isMe.id === id ? (
                  <DeleteButton onPress={() => onDeleteComment(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="tomato" />
                  </DeleteButton>
                ) : null}
              </BottomContainer>
            </Container>
          ) : null;
        }}
      />
    </ScrollView>
  );
}

const Container = styled.View`
  width: ${ITEM_WIDTH}px;
  height: ${ITEM_HEIGHT}px;
  margin: ${SPACE}px;
  border: 2px solid ${(props) => props.theme.txtColor};
  border-radius: 16px;
`;
const InnerContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
`;

const BottomContainer = styled(InnerContainer)`
  position: absolute;
  margin-top: 160px;
`;

const DayText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.txtColor};
`;

const UserInfo = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 75px;
`;
const Username = styled.Text`
  color: ${(props) => props.theme.txtColor};
  margin-left: 5px;
  font-weight: bold;
`;
const Payload = styled.Text`
  color: ${(props) => props.theme.activeColor};
  padding: 10px;
`;

interface RangeProps {
  range: string;
}
const RangeView = styled.View<RangeProps>`
  border: 1px solid
    ${(props) =>
      props.range === "Public"
        ? props.theme.activeColor
        : props.range === "Private"
        ? "tomato"
        : props.range === "Follower"
        ? props.theme.txtColor
        : null};
  border-radius: 10px;
  margin-left: 10px;
  padding: 0 3px 0 3px;
`;

const RangeText = styled.Text<RangeProps>`
  color: ${(props) =>
    props.range === "Public"
      ? props.theme.activeColor
      : props.range === "Private"
      ? "tomato"
      : props.range === "Follower"
      ? props.theme.txtColor
      : null};
`;

const DeleteButton = styled.TouchableOpacity`
  margin-left: 15px;
`;

const MoreButton = styled.TouchableOpacity``;
const MoreText = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
