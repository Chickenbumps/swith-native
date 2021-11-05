import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelectTheme } from "../styles";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/core";

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

export default function DrawerContent({ id, username }: any) {
  const navigation = useNavigation();
  const theme = useSelectTheme();
  const { data, loading } = useQuery(SEE_GROUP_QUERY, {
    variables: {
      id: id,
      offset: 0,
    },
  });
  const me = data?.seeGroup?.members?.find(
    (item: any) => item.username === username
  );
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
            <Avatar source={{ uri: me?.avatar }} />
            <Me>me</Me>
            <MyUsername>{me?.username}</MyUsername>
          </MemberView>
          {data?.seeGroup?.members?.map((item: any, index: number) =>
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
                <Avatar source={{ uri: item.avatar }} />
                <Username>{item.username}</Username>
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
  padding: 5px 0;
`;
const Avatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 10px;
`;
const Username = styled.Text`
  font-size: 16px;
  margin-left: 10px;
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
`;
