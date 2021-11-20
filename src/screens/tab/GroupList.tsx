import { gql, useQuery } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
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
      groupAvatar
      unreadMessage
      members {
        id
        username
        avatar
        isObserver
        observers {
          id
          username
        }
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

export default function GroupList({ navigation, route }: GroupListScreenProps) {
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

  useEffect(() => {
    refetch();
  }, [route.params]);

  return (
    <ScreenLayout loading={loading} isKeyboard={false}>
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
              memberNum={group.members.length}
              unreadMessage={group.unreadMessage}
              groupAvatar={group.groupAvatar}
              key={index}
              onPress={() =>
                navigation.navigate("Drawer", {
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
