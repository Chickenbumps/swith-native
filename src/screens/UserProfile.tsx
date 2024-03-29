import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useForm } from "react-hook-form";
import { StackScreenProps } from "@react-navigation/stack";
import ScreenLayout from "../components/ScreenLayout";
import { useSelectTheme } from "../styles";
import { seeProfile, seeProfileVariables } from "../__generated__/seeProfile";
import { LoggedInNavStackParamList } from "../navigation/Router";
import useUser from "../hooks/useUser";
import {
  followToggle,
  followToggleVariables,
} from "../__generated__/followToggle";
import CommentList from "./CommentList";

const FOLLOW_TOGGLE = gql`
  mutation followToggle($username: String!) {
    followToggle(username: $username) {
      ok
      result
    }
  }
`;

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

type UserProfileScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "UserProfile"
>;

export default function UserProfile({
  route,
  navigation,
}: UserProfileScreenProps) {
  const theme = useSelectTheme();
  const { data: userData, loading: userLoading, refetch } = useQuery<
    seeProfile,
    seeProfileVariables
  >(SEE_PROFILE_QUERY, {
    variables: {
      username: route.params?.username,
    },
  });
  const [followToggle] = useMutation<followToggle, followToggleVariables>(
    FOLLOW_TOGGLE,
    {
      update: (cache, updateResult: any) => {
        const {
          data: {
            followToggle: { ok, result },
          },
        } = updateResult;
        console.log(result);
        if (!ok) {
          return;
        }
        cache.modify({
          id: `User:${userData?.seeProfile.id}`,
          fields: {
            isFollowing(prev: any) {
              return !prev;
            },
            totalFollowers(prev: any) {
              let total = prev;
              result === "followed" ? (total += 1) : (total -= 1);
              return total;
            },
          },
        });
        cache.modify({
          id: `User:${meData?.isMe.id}`,
          fields: {
            totalFollowing(prev: any) {
              let total = prev;
              result === "followed" ? (total += 1) : (total -= 1);
              return total;
            },
          },
        });
      },
    }
  );
  const { data: meData } = useUser();

  useLayoutEffect(() => {
    refetch();
    navigation.setOptions({
      headerLeft: () => (
        <BackBtn onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-outline"
            size={30}
            color={theme.txtColor}
          />
        </BackBtn>
      ),
    });
  }, [navigation, route?.params]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgColor }}>
      <ScreenLayout loading={userLoading} isKeyboard={false}>
        <UserInfo>
          {userData?.seeProfile?.avatar ? (
            <Avatar
              source={{
                uri: userData.seeProfile.avatar,
              }}
            />
          ) : (
            <Avatar source={require("../../assets/image/default.png")} />
          )}
          <Username>{userData?.seeProfile.username}</Username>
          <Bio>{userData?.seeProfile.bio}</Bio>
          {route.params.username !== meData?.isMe.username ? (
            userData?.seeProfile.isFollowing ? (
              <FollowBtn
                isFollow={false}
                onPress={() =>
                  followToggle({
                    variables: {
                      username: route.params?.username,
                    },
                  })
                }
              >
                <FollowBtnText>팔로우 취소</FollowBtnText>
              </FollowBtn>
            ) : (
              <FollowBtn
                isFollow={true}
                onPress={() =>
                  followToggle({
                    variables: {
                      username: route.params?.username,
                    },
                  })
                }
              >
                <FollowBtnText>팔로우 하기</FollowBtnText>
              </FollowBtn>
            )
          ) : null}

          <FollowWrapper>
            <FollowItem>
              <FollowText>팔로워</FollowText>

              <FollowText>{userData?.seeProfile.totalFollowers}</FollowText>
            </FollowItem>
            <FollowItem>
              <FollowText>팔로잉</FollowText>
              <FollowText>{userData?.seeProfile.totalFollowing}</FollowText>
            </FollowItem>
          </FollowWrapper>
        </UserInfo>
        <CommentList
          id={userData?.seeProfile.id}
          username={userData?.seeProfile.username}
          avatar={userData?.seeProfile.avatar}
        />
      </ScreenLayout>
    </ScrollView>
  );
}

const UserInfo = styled.View`
  align-items: center;
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

const Bio = styled(Username)`
  margin-bottom: 10px;
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

interface isFollowProps {
  isFollow: boolean;
}

const FollowBtn = styled.TouchableOpacity<isFollowProps>`
  background-color: ${(props) =>
    props.isFollow ? props.theme.txtColor : "tomato"};
  border-radius: 10px;
  height: 30px;
  width: 100px;
  align-items: center;
  justify-content: center;
`;

const FollowBtnText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  font-weight: bold;
`;

const BackBtn = styled.TouchableOpacity``;
