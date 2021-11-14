import { StackScreenProps } from "@react-navigation/stack";
import React, { useLayoutEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import { LoggedInNavStackParamList } from "../navigation/Router";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  seeGroupInfo,
  seeGroupInfoVariables,
} from "../__generated__/seeGroupInfo";
import moment from "moment";
import useUser from "../hooks/useUser";
import {
  joinGroup,
  joinGroupVariables,
  joinGroup_joinGroup,
} from "../__generated__/joinGroup";

const SEE_GROUP_INFO = gql`
  query seeGroupInfo($id: Int!) {
    seeGroupInfo(id: $id) {
      title
      description
      members {
        username
        avatar
      }
      inviter {
        user {
          username
          avatar
        }
      }
      groupAvatar
      memberNum
      createdAt
    }
  }
`;

const JOIN_GROUP_MUTATION = gql`
  mutation joinGroup($groupId: Int!) {
    joinGroup(groupId: $groupId) {
      ok
      error
    }
  }
`;

type GroupInfoScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "GroupInfo"
>;
export default function GroupInfo({ route, navigation }: GroupInfoScreenProps) {
  const { data: groupInfoData, loading: groupInfoLoading } = useQuery<
    seeGroupInfo,
    seeGroupInfoVariables
  >(SEE_GROUP_INFO, {
    variables: {
      id: route.params?.id,
    },
  });
  const [
    joinGroup,
    { data: joinGroupData, loading: joinGroupLoading },
  ] = useMutation<joinGroup, joinGroupVariables>(JOIN_GROUP_MUTATION, {
    onCompleted: (data: joinGroup) => {
      const {
        joinGroup: { ok, error },
      } = data;
      if (ok) {
        navigation.replace("Drawer", {
          id: route.params?.id,
          username: meData?.isMe?.username,
        });
      } else {
        Alert.alert(`${error}`);
      }
    },
  });
  console.log(
    groupInfoData?.seeGroupInfo.members.find(
      (item) => item?.username === meData?.isMe.username
    )
  );
  const { data: meData } = useUser();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        groupInfoData?.seeGroupInfo.members.find(
          (item) => item?.username === meData?.isMe.username
        ) !== undefined ? null : (
          <JoinBtn
            onPress={() =>
              joinGroup({
                variables: {
                  groupId: route.params?.id,
                },
              })
            }
          >
            <JoinText>입장</JoinText>
          </JoinBtn>
        ),
    });
  }, []);

  return (
    <Container>
      <GroupNavView>
        <GroupTitleView>
          <GroupTitle>{groupInfoData?.seeGroupInfo?.title}</GroupTitle>
        </GroupTitleView>
        <GroupCreatedAt>
          {`그룹 생성일: ${moment(groupInfoData?.seeGroupInfo.createdAt).format(
            "YYYY.MM.DD"
          )}`}
        </GroupCreatedAt>
        <GroupMemberNum>
          {`그룹 멤버수: ${groupInfoData?.seeGroupInfo.memberNum}명`}
        </GroupMemberNum>
      </GroupNavView>
      <RankLimitView>
        <RankNavView>
          <RankNavText>랭크 제한</RankNavText>
          <Rank>
            <RankText>Bronze</RankText>
          </Rank>
        </RankNavView>

        <GroupMember>
          {groupInfoData?.seeGroupInfo.members.map((item, index) => (
            <Avatar source={{ uri: item?.avatar }} key={index} />
          ))}
        </GroupMember>
      </RankLimitView>
      <DescView>
        <DescNavView>
          <DescNavText>{groupInfoData?.seeGroupInfo.description}</DescNavText>
        </DescNavView>
      </DescView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
`;

const GroupNavView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 0 10px 20px;
`;
const GroupTitleView = styled.View`
  border-bottom-color: #f1f3f5;
  border-bottom-width: 1px;
  margin-bottom: 10px;
  padding-bottom: 10px;
`;
const GroupTitle = styled.Text`
  font-size: 16px;
`;
const GroupCreatedAt = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
  color: #c7c8ca;
`;
const GroupMemberNum = styled.Text`
  font-size: 16px;
  color: #c7c8ca;
`;

const GroupMember = styled.View`
  margin: 10px 0 10px 10px;
  flex-direction: row;
  align-items: center;
`;

const Avatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 75px;
  margin-left: 10px;
`;

const RankLimitView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  margin-top: 20px;
`;

const RankNavView = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.theme.bgColor};
  border-bottom-color: #f1f3f5;
  border-bottom-width: 1px;
  padding: 10px 0;
`;
const RankNavText = styled.Text`
  font-size: 16px;
  margin: 0 20px;
`;

const Rank = styled.View`
  border: 1px solid ${(props) => props.theme.txtColor};
  border-radius: 10px;
  width: 60px;
  align-items: center;
  justify-content: center;
`;

const RankText = styled.Text``;

const DescView = styled(RankLimitView)``;
const DescNavView = styled(RankNavView)``;

const DescNavText = styled.Text`
  font-size: 16px;
  margin-left: 20px;
`;

const JoinBtn = styled.TouchableOpacity`
  padding: 10px;
`;

const JoinText = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
