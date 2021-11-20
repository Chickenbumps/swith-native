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
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../../navigation/Router";
import { useSelectTheme } from "../../styles";
import moment from "moment";
import momentDuraionFormatSetup from "moment-duration-format";
//@ts-ignore
momentDuraionFormatSetup(moment);
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
type RankingScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "Ranking"
>;
export default function Ranking({ navigation }: RankingScreenProps) {
  const theme = useSelectTheme();
  const navList = ["todayTime", "weekTime", "monthTime", "totalTime"];
  const navKorList = ["일간 랭킹", "주간 랭킹", "월간 랭킹", "종합 랭킹"];
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
  const [curKorNav, setCurKorNav] = useState(navKorList[cnt]);
  useEffect(() => {
    setCurNav(navList[cnt]);
    setCurKorNav(navKorList[cnt]);
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
          <Ionicons
            name="chevron-back-outline"
            size={28}
            color={theme.txtColor}
          />
        </LeftArrow>
        <NavText>{curKorNav}</NavText>
        <RightArrow
          onPress={() => {
            if (cnt < navList.length - 1) {
              setCnt((cnt) => cnt + 1);
            } else if (cnt >= navList.length - 1) {
              setCnt((cnt) => cnt - navList.length + 1);
            }
          }}
        >
          <Ionicons
            name="chevron-forward-outline"
            size={28}
            color={theme.txtColor}
          />
        </RightArrow>
      </NavRanking>
      <NavContainer>
        <NumRankNavView>
          <NumRankNav>순위</NumRankNav>
        </NumRankNavView>
        <UserNavView>
          <UserNav>유저</UserNav>
        </UserNavView>
        <TimeNavView>
          <TimeNav>시간</TimeNav>
        </TimeNavView>
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
          let day, hour, minute, second, total;
          if (curNav == "todayTime") {
            hour = moment.duration(user.todayTime, "h").format("hh:mm:ss");
          } else if (curNav == "weekTime") {
            hour = moment.duration(user.weekTime, "h").format("hh:mm:ss");
          } else if (curNav == "monthTime") {
            hour = moment.duration(user.monthTime, "h").format("hh:mm:ss");
          } else {
            hour = moment.duration(user.totalTime, "h").format("hh:mm:ss");
          }
          if (hour == "00") {
            hour = `00:00:00`;
          } else if (hour.length === 5) {
            hour = "00:" + hour;
          }
          return (
            <FlatContainer>
              <NumRankView>
                <Throphy>
                  {index == 0 ? (
                    <Ionicons name="trophy" size={26} color="gold" />
                  ) : index == 1 ? (
                    <Ionicons name="trophy" size={26} color="silver" />
                  ) : index == 2 ? (
                    <Ionicons name="trophy" size={26} color="brown" />
                  ) : null}
                </Throphy>
                <NumRank>{index + 1}</NumRank>
              </NumRankView>

              <UserInfo
                onPress={() =>
                  navigation.navigate("UserProfile", {
                    username: user.username,
                  })
                }
              >
                <Avatar source={{ uri: user.avatar }} />
                <Username>{user.username}</Username>
              </UserInfo>

              {curNav === "todayTime" ? (
                <TimeView>
                  <TotalTime>{`${hour}`}</TotalTime>
                </TimeView>
              ) : null}
              {curNav === "weekTime" ? (
                <TimeView>
                  <TotalTime>{`${hour}`}</TotalTime>
                </TimeView>
              ) : null}
              {curNav === "monthTime" ? (
                <TimeView>
                  <TotalTime>{`${hour}`}</TotalTime>
                </TimeView>
              ) : null}
              {curNav === "totalTime" ? (
                <TimeView>
                  <TotalTime>{`${hour}`}</TotalTime>
                </TimeView>
              ) : null}
            </FlatContainer>
          );
        }}
      />
    </ScreenLayout>
  );
}
const NavRanking = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;
const NavText = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.txtColor};
`;
const RightArrow = styled.TouchableOpacity``;
const LeftArrow = styled.TouchableOpacity``;

const FlatContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-left: 10px;
  margin-bottom: 10px;
`;

const NavContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-left: 20px;
  margin-bottom: 10px;
`;
const NumRankNavView = styled.View`
  width: 30px;
  align-items: center;
`;

const NumRankNav = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-weight: bold;
  font-size: 14px;
`;
const NumRankView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 30px;
`;
const Throphy = styled.View``;

const NumRank = styled.Text`
  padding-left: 10px;
  color: ${(props) => props.theme.txtColor};
`;

const UserNavView = styled.View`
  width: 120px;
  align-items: center;
`;
const UserNav = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-weight: bold;
`;

const UserInfo = styled.TouchableOpacity`
  width: 120px;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  margin-left: 20px;
`;
const Avatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 75px;
`;
const Username = styled.Text`
  margin-left: 5px;
  color: ${(props) => props.theme.txtColor};
`;
const TimeNavView = styled.View`
  width: 70px;
  align-items: center;
`;

const TimeNav = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-weight: bold;
`;
const TodayTime = styled.Text``;
const WeekTime = styled.Text``;
const MonthTime = styled.Text``;
const TimeView = styled.View`
  width: 70px;
  align-items: center;
  color: ${(props) => props.theme.txtColor};
`;
const TotalTime = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
const Rank = styled.Text``;
