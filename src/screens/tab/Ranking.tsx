import { useQuery, gql } from "@apollo/client";

import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";
import GroupItem from "../../components/GroupItem";
import ScreenLayout from "../../components/ScreenLayout";
import {
  seeRanking,
  seeRanking_seeRanking,
} from "../../__generated__/seeRanking";
import { Ionicons } from "@expo/vector-icons";
const SEE_RANKING = gql`
  query seeRanking(
    $rank: Boolean
    $todayTime: Boolean
    $weekTime: Boolean
    $monthTime: Boolean
    $totalTime: Boolean
  ) {
    seeRanking(
      rank: $rank
      todayTime: $todayTime
      weekTime: $weekTime
      monthTime: $monthTime
      totalTime: $totalTime
    ) {
      id
      avatar
      username
      rank
      todayTime
      weekTime
      monthTime
      totalTime
    }
  }
`;

export default function Ranking() {
  const navList = ["todayTime", "weekTime", "monthTime", "totalTime"];
  const { data: todayTime, loading } = useQuery<seeRanking>(SEE_RANKING, {
    variables: {
      todayTime: true,
    },
  });
  const { data: weekTime } = useQuery<seeRanking>(SEE_RANKING, {
    variables: {
      weekTime: true,
    },
  });
  const { data: monthTime } = useQuery<seeRanking>(SEE_RANKING, {
    variables: {
      monthTime: true,
    },
  });
  const { data: totalTime } = useQuery<seeRanking>(SEE_RANKING, {
    variables: {
      totalTime: true,
    },
  });
  const [cnt, setCnt] = useState(0);
  const [curNav, setCurNav] = useState(navList[cnt]);

  useEffect(() => {
    setCurNav(navList[cnt]);
  }, [cnt]);
  return (
    <ScreenLayout isKeyboard={false} loading={loading}>
      <NavRanking>
        <LeftArrow
          onPress={() => {
            if (cnt > 0) {
              setCnt((cnt) => cnt - 1);
            } else if (cnt <= 0) {
              setCnt((cnt) => cnt + navList.length - 1);
            }
          }}
        >
          <Ionicons name="chevron-back-outline" size={20} />
        </LeftArrow>
        <NavText>{curNav}</NavText>
        <RightArrow
          onPress={() => {
            if (cnt < navList.length - 1) {
              setCnt((cnt) => cnt + 1);
            } else if (cnt >= navList.length - 1) {
              setCnt((cnt) => cnt - navList.length + 1);
            }
          }}
        >
          <Ionicons name="chevron-forward-outline" size={20} />
        </RightArrow>
      </NavRanking>
      <NavContainer>
        <NumRankNav>순위</NumRankNav>
        <UserNav>유저</UserNav>
        <TimeNav>시간</TimeNav>
      </NavContainer>
      <FlatList
        data={eval(curNav)?.seeRanking}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({
          item: user,
          index,
        }: {
          item: seeRanking_seeRanking;
          index: number;
        }) => {
          const x = eval(curNav);
          return (
            <Container>
              <NumRank>{index + 1}</NumRank>
              <Avatar source={{ uri: user.avatar }} />
              <Username>{user.username}</Username>
              {curNav === "todayTime" ? (
                <TimeView>
                  <TotalTime>{user.todayTime}</TotalTime>
                </TimeView>
              ) : null}
              {curNav === "weekTime" ? (
                <TimeView>
                  <TotalTime>{user.weekTime}</TotalTime>
                </TimeView>
              ) : null}
              {curNav === "monthTime" ? (
                <TimeView>
                  <TotalTime>{user.monthTime}</TotalTime>
                </TimeView>
              ) : null}
              {curNav === "totalTime" ? (
                <TimeView>
                  <TotalTime>{user.totalTime}</TotalTime>
                </TimeView>
              ) : null}
            </Container>
          );
        }}
      />
    </ScreenLayout>
  );
}
const NavRanking = styled.View`
  flex-direction: row;
  justify-content: center;
`;
const NavText = styled.Text``;
const RightArrow = styled.TouchableOpacity``;
const LeftArrow = styled.TouchableOpacity``;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-left: 60px;
`;

const NavContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const NumRankNav = styled.Text``;
const NumRank = styled.Text`
  width: 30px;
`;

const UserNav = styled.Text``;
const Avatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 75px;
  margin-left: 50px;
`;
const Username = styled.Text`
  width: 80px;
  margin-left: 5px;
`;
const TimeNav = styled.Text``;
const TodayTime = styled.Text``;
const WeekTime = styled.Text``;
const MonthTime = styled.Text``;
const TimeView = styled.View`
  width: 40px;
  margin-left: 60px;
`;
const TotalTime = styled.Text``;
const Rank = styled.Text``;
