import { gql, useQuery } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { useLayoutEffect } from "react";
import { useState } from "react";
import { RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import GroupItem from "../../components/GroupItem";
import ScreenLayout from "../../components/ScreenLayout";
import useUser from "../../hooks/useUser";
import { LoggedInNavStackParamList } from "../../navigation/Router";
import { useSelectTheme } from "../../styles";
import { seeGroups, seeGroups_seeGroups } from "../../__generated__/seeGroups";

const SEE_GROUPS_QUERY = gql`
  query seeGroups {
    seeGroups {
      id
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
type GroupListScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "GroupList"
>;

export default function GroupList({ navigation }: GroupListScreenProps) {
  const theme = useSelectTheme();
  const { data: userData } = useUser();
  const { data: groupsData, loading, refetch } = useQuery<seeGroups>(
    SEE_GROUPS_QUERY
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        data={groupsData?.seeGroups}
        keyExtractor={(item, index) => item.id.toString() + index}
        onRefresh={onRefresh}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            tintColor={theme.activeColor}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={({
          item: group,
          index,
        }: {
          item: seeGroups_seeGroups;
          index: number;
        }) => {
          return (
            <GroupItem
              title={group.title}
              description={group.description}
              members={group.members}
              unreadMessage={3}
              key={index}
              onPress={() =>
                navigation.navigate("Group", {
                  id: group.id,
                  username: userData!.isMe!.username,
                })
              }
            />
          );
        }}
      />
    </ScreenLayout>
  );
}
