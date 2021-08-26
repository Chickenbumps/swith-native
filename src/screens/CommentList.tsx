import React, { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import useUser from "../hooks/useUser";
import {
  seeComments,
  seeCommentsVariables,
} from "../__generated__/seeComments";
import { useSelectTheme } from "../styles";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const SPACE = 12;

const ITEM_WIDTH = 168;
const ITEM_HEIGHT = ITEM_WIDTH * 1.2;
const FULL_SIZE = ITEM_WIDTH + SPACE * 2;

const SEE_COMMENTS_QUERY = gql`
  query seeComments($offset: Int!) {
    seeComments(offset: $offset) {
      id
      payload
      user {
        username
      }
      isMine
      createdAt
      updatedAt
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

export default function CommentList({ onPress }: any) {
  const theme = useSelectTheme();
  const { data: userData } = useUser();
  const [refreshing, setRefreshing] = useState(false);
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
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          tintColor={theme.activeColor}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {loading ? (
        <ActivityIndicator color={theme.activeColor} size="large" />
      ) : (
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
            const year = item.createdAt.slice(0, 4);
            const month = item.createdAt.slice(5, 7);
            const day = item.createdAt.slice(8, 10);
            return (
              <Container>
                <InnerContainer>
                  <UserInfo>
                    {userData?.isMe.avatar ? (
                      <Avatar
                        source={{
                          uri: userData.isMe.avatar,
                        }}
                      />
                    ) : null}
                    <Username>{userData?.isMe.username}</Username>
                  </UserInfo>
                  <MoreButton onPress={onPress}>
                    <MoreText>더보기</MoreText>
                  </MoreButton>
                </InnerContainer>
                <Payload>{item.payload}</Payload>

                <BottomContainer>
                  <DayText>{`${year}년${month}월${day}일`}</DayText>
                  <DeleteButton onPress={() => onDeleteComment(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="tomato" />
                  </DeleteButton>
                </BottomContainer>
              </Container>
            );
          }}
        />
      )}
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

const Avatar = styled.Image`
  width: 30px;
  height: 30px;
`;
const UserInfo = styled.View`
  flex-direction: row;
`;
const Username = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
const Payload = styled.Text`
  color: ${(props) => props.theme.activeColor};
  padding: 10px;
`;

const DeleteButton = styled.TouchableOpacity`
  margin-left: 40px;
`;

const MoreButton = styled.TouchableOpacity``;
const MoreText = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
