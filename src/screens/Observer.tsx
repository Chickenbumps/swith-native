import {
  ApolloCache,
  FetchResult,
  gql,
  useMutation,
  useQuery,
} from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import useUser from "../hooks/useUser";
import { LoggedInNavStackParamList } from "../navigation/Router";
import { useSelectTheme } from "../styles";
import {
  seeGroups,
  seeGroups_seeGroups_members,
} from "../__generated__/seeGroups";
import {
  selectObserver,
  selectObserverVariables,
} from "../__generated__/selectObserver";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const SEE_GROUPS_QUERY = gql`
  query seeGroups {
    seeGroups {
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
    }
  }
`;
const SELECT_OBSERVER_MUTATION = gql`
  mutation selectObserver($username: String!) {
    selectObserver(username: $username) {
      ok
      user {
        id
        username
        avatar
        isObserver
      }
      error
    }
  }
`;

type ObserverScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "Observer"
>;

export default function Observer({ navigation }: ObserverScreenProps) {
  const theme = useSelectTheme();
  const { data, error, loading: groupLoading } = useQuery<seeGroups>(
    SEE_GROUPS_QUERY
  );
  const { data: meData, refetch } = useUser();
  const allMember = data?.seeGroups?.map((group) =>
    group.members.filter((member) => member.id !== meData?.isMe.id)
  );
  const distictMember = Array.from(new Set(allMember?.flat()));
  const myData = data?.seeGroups[0]?.members.find(
    (member) => member.id === meData?.isMe.id
  );

  const [selectObserver, { data: observerData, loading }] = useMutation<
    selectObserver,
    selectObserverVariables
  >(SELECT_OBSERVER_MUTATION, {
    update: (cache: ApolloCache<any>, result: FetchResult<any>) => {
      const {
        data: {
          selectObserver: { ok, user, error },
        },
      } = result;
      if (ok) {
        const observerObj = {
          __typename: "User",
          avatar: user.avatar,
          id: user.id,
          isObserver: user.isObserver,
          username: user.username,
        };
        const observerFragment = cache.writeFragment({
          fragment: gql`
            fragment NewObserver on User {
              id
              avatar
              isObserver
              username
            }
          `,
          data: observerObj,
        });
        cache.modify({
          id: `User:${meData?.isMe.id}`,
          fields: {
            observers(prev) {
              console.log("user:", user);
              if (user.isObserver) {
                return [...prev, observerFragment];
              }
              let removedPrev = null;
              if (prev[0].__ref) {
                console.log(prev[0].__ref);
                removedPrev = prev.filter(
                  (observer: any) => observer.__ref !== `User:${user.id}`
                );
              } else {
                removedPrev = prev.filter(
                  (observer: any) => observer.id !== user.id
                );
              }
              console.log(removedPrev);
              return [...removedPrev];
            },
          },
        });
      }
    },
  });

  const onSelectObserver = (member: seeGroups_seeGroups_members) => {
    if (!loading) {
      selectObserver({
        variables: {
          username: member.username,
        },
      });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerBackImage: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home", { observers: myData?.observers });
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            size={28}
            color={theme.txtColor}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, myData?.observers]);
  4;

  return (
    <ScreenLayout loading={groupLoading} isKeyboard={false}>
      <CurrentObserverView>
        <CurrentObserverText>감시자 목록:</CurrentObserverText>
        {myData?.observers?.map((observer, index) => (
          <CurrentObserver key={index}>{observer?.username} </CurrentObserver>
        ))}
      </CurrentObserverView>
      <FlatList
        data={distictMember}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: member }: { item: seeGroups_seeGroups_members }) =>
          meData?.isMe.id !== member.id ? (
            <ObserverList>
              <ObserverInfo
                onPress={() =>
                  navigation.navigate("UserProfile", {
                    username: member.username,
                  })
                }
              >
                <Avatar source={{ uri: member?.avatar }} />
                <ObserverText style={{ color: `${theme.txtColor}` }}>
                  {member.username}
                </ObserverText>
              </ObserverInfo>
              {member.isObserver ? (
                <Pick isExist={true} onPress={() => onSelectObserver(member)}>
                  <PickText>삭제</PickText>
                </Pick>
              ) : (
                <Pick isExist={false} onPress={() => onSelectObserver(member)}>
                  <PickText>추가</PickText>
                </Pick>
              )}
            </ObserverList>
          ) : null
        }
      />
    </ScreenLayout>
  );
}

const ObserverList = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin: 15px;
`;

const CurrentObserverView = styled.View`
  flex-direction: row;
  justify-content: center;
  border-bottom-color: ${(props) => props.theme.txtColor};
  border-bottom-width: 0.3px;
`;
const CurrentObserverText = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-size: 18px;
`;
const CurrentObserver = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-size: 18px;
`;

const ObserverInfo = styled.TouchableOpacity`
  flex-direction: row;
`;
const ObserverText = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-size: 20px;
  margin-left: 5px;
`;
const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 10px;
`;

interface isExistProps {
  isExist: boolean;
}

const Pick = styled.TouchableOpacity<isExistProps>`
  background-color: ${(props) =>
    props.isExist ? "tomato" : props.theme.txtColor};
  border-radius: 10px;
  height: 30px;
  width: 40px;
  align-items: center;
  justify-content: center;
`;

const PickText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  font-weight: bold;
`;
