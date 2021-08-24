import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import GroupItem from "../../components/GroupItem";
import ScreenLayout from "../../components/ScreenLayout";
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

export default function Group() {
  const theme = useSelectTheme();
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
              key={index}
            />
          );
        }}
      />
    </ScreenLayout>
  );
}
