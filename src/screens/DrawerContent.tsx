import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelectTheme } from "../styles";
import gql from "graphql-tag";
import { ApolloCache, useMutation, useQuery } from "@apollo/client";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { kickMember, kickMemberVariables } from "../__generated__/kickMember";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../navigation/Router";
import useUser from "../hooks/useUser";

const SEE_GROUP_QUERY = gql`
  query seeGroup($id: Int!, $offset: Int!) {
    seeGroup(id: $id, offset: $offset) {
      title
      description
      members {
        id
        username
        avatar
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

const KICK_MEMBER_MUTATION = gql`
  mutation kickMember($groupId: Int!, $memberId: Int!) {
    kickMember(groupId: $groupId, memberId: $memberId) {
      ok
      kickedUserId
      error
    }
  }
`;

interface DrawerProps {
  id: number;
  username: string | undefined;
  route: RouteProp<LoggedInNavStackParamList, "Drawer">;
  navigation: StackNavigationProp<LoggedInNavStackParamList, "Drawer">;
}
export default function DrawerContent({
  route,
  navigation,
  id,
  username,
}: DrawerProps) {
  const theme = useSelectTheme();
  const { data: seeGroupData, loading, refetch } = useQuery(SEE_GROUP_QUERY, {
    variables: {
      id: id,
      offset: 0,
    },
  });
  const { data: meData } = useUser();
  const me = seeGroupData?.seeGroup?.members?.find(
    (item: any) => item.username === username
  );
  const [kickedId, setKickedId] = useState<any>(null);
  const [kickMember, { data: kickMemberData }] = useMutation<
    kickMember,
    kickMemberVariables
  >(KICK_MEMBER_MUTATION, {
    update: (cache: ApolloCache<any>, result: any) => {
      const {
        data: {
          kickMember: { ok, kickedUserId, error },
        },
      } = result;
      console.log(ok);
      console.log(error);
      if (ok) {
        me.id === kickedUserId ? setKickedId(kickedUserId) : null;
        refetch();
      }
      cache.modify({
        id: `Group:${id}`,
        fields: {
          members(prev) {
            return prev.filter((member: any) => member.id !== kickedUserId);
          },
        },
      });
      const afterGroup = {
        __typename: "Group",
        description: "테스트에서는",
        inviter: {
          __ref: "Inviter:2",
        },
        members: [
          {
            __ref: "User:1",
          },
          {
            __ref: "User:5",
          },
        ],
        title: "테스트 방",
      };
      const afterKickGroup = afterGroup.members.filter(
        (item) => item.__ref != `User:${kickedUserId}`
      );
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeGroup(prev) {
            return afterKickGroup;
          },
        },
      });
    },
  });
  useEffect(() => {
    refetch();
    kickedId === meData?.isMe?.id
      ? Alert.alert("접근 불가", "그룹에서 추방 당했습니다.", [
          {
            text: "확인",
            onPress: () => navigation.replace("GroupList", { isCreated: true }),
          },
        ])
      : null;
  }, [seeGroupData, kickedId]);

  return (
    <Container>
      <DrawerContentScrollView>
        <GroupMemberView>
          <GroupMemberNav>그룹멤버</GroupMemberNav>
          <InviteMemberView>
            <Ionicons
              name="add-circle-outline"
              size={40}
              color={`${theme.txtColor}`}
            />
            <InviteMemberText>그룹멤버 초대</InviteMemberText>
          </InviteMemberView>
          <MemberView>
            <UserInfo>
              <Avatar source={{ uri: me?.avatar }} />
              <Me>me</Me>
              <MyUsername>{me?.username}</MyUsername>
            </UserInfo>
          </MemberView>
          {seeGroupData?.seeGroup?.members?.map((item: any, index: number) =>
            item.username !== username ? (
              <MemberView
                key={index}
                onPress={() =>
                  //@ts-ignore
                  navigation.navigate("UserProfile", {
                    username: item.username,
                  })
                }
              >
                <UserInfo>
                  <Avatar source={{ uri: item.avatar }} />
                  <Username>{item.username}</Username>
                </UserInfo>
                {me?.username ===
                seeGroupData?.seeGroup?.inviter.user.username ? (
                  <KickBtnView>
                    <KickBtn
                      onPress={() =>
                        kickMember({
                          variables: {
                            groupId: id,
                            memberId: item.id,
                          },
                        })
                      }
                    >
                      <KickText>추방</KickText>
                    </KickBtn>
                  </KickBtnView>
                ) : null}
              </MemberView>
            ) : null
          )}
        </GroupMemberView>
      </DrawerContentScrollView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding-left: 10px;
`;

const GroupMemberView = styled.View``;
const GroupMemberNav = styled.Text`
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 10px;
`;
const InviteMemberView = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const InviteMemberText = styled.Text`
  margin-left: 6px;
  font-size: 16px;
  font-weight: 300;
`;
const MemberView = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;
const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Avatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 75px;
`;
const Username = styled.Text`
  margin-left: 10px;
  font-size: 16px;
  font-weight: 300;
`;
const MyUsername = styled.Text`
  font-size: 16px;
  font-weight: 300;
`;

const Me = styled.Text`
  border: 1px solid ${(props) => props.theme.txtColor};
  border-radius: 8px;
  margin-left: 10px;
  margin-right: 2px;
`;

const KickBtnView = styled.View`
  align-items: flex-end;
  justify-content: flex-end;
`;
const KickBtn = styled.TouchableHighlight`
  width: 30px;
  height: 20px;
  border-radius: 8px;
  background-color: tomato;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;
const KickText = styled.Text`
  color: ${(props) => props.theme.bgColor};
`;
