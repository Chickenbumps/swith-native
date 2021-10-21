import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components/native";
import ExpBar from "../../components/ExpBar";
import HomeLayout from "../../components/HomeLayout";
import { Rank } from "../../components/Rank";
import WeekEntry from "../../components/WeekEntry";
import useUser from "../../hooks/useUser";
import { screenXY, useSelectTheme } from "../../styles";
import moment from "moment";
moment.locale("ko");
import { seeTimes, seeTimesVariables } from "../../__generated__/seeTimes";
import { ScrollView, TouchableOpacity } from "react-native";
import Medal from "../../components/Medal";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../../navigation/Router";
import { useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
const SEE_TIMES_QUERY = gql`
  query seeTimes($to: String!, $from: String!) {
    seeTimes(to: $to, from: $from) {
      id
      timeValue
      timeNumber
      dayName
      updatedAt
    }
  }
`;

type HomeScreenProps = StackScreenProps<LoggedInNavStackParamList, "Home">;
export default function Home({ navigation, route }: HomeScreenProps) {
  const theme = useSelectTheme();
  const { data: meData, refetch, loading } = useUser();
  const { data: weekData, refetch: timeRefetch } = useQuery<
    seeTimes,
    seeTimesVariables
  >(SEE_TIMES_QUERY, {
    variables: {
      to: moment().subtract(moment().day(), "days").format("YYYYMMDD"),
      from: moment().format("YYYYMMDD"),
    },
  });
  // console.log(moment().day());
  const dtime = moment().format("YYYY-MM-DD");
  // console.log(moment().format("YYYY-MM-DD"));

  const weekName = ["일", "월", "화", "수", "목", "금", "토"];
  const test = moment().subtract(7, "days").format("YYYYMMDD");
  const hour = Math.floor(
    meData?.isMe?.todayTime ? meData?.isMe?.todayTime : 0
  );
  const minute =
    ((meData?.isMe?.todayTime ? meData?.isMe?.todayTime : 0) - hour) * 60;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          // onPress={navigation.navigate("PushNotification")}
        >
          <Ionicons name="notifications" size={24} color={theme.txtColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    refetch();
    timeRefetch();
  }, [route?.params?.observers, meData?.isMe?.todayTime]);

  const goToObserver = () => {
    return navigation.navigate("Observer");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgColor }}>
      <HomeLayout loading={loading}>
        <RankText>현재 랭크:</RankText>
        <Rank rank={meData?.isMe ? meData.isMe.rank : "Bronze"}>
          {meData?.isMe?.rank}
        </Rank>
        <Medal
          maxExp={
            meData?.isMe && meData.isMe.maxExp !== null ? meData.isMe.maxExp : 0
          }
          exp={meData?.isMe && meData.isMe.exp !== null ? meData.isMe.exp : 0}
        />
        <ExpBar
          step={meData?.isMe?.exp ? meData.isMe.exp : 0}
          steps={meData?.isMe?.maxExp ? meData.isMe.maxExp : 10}
        />
        <TimeContainer>
          <DateText>{moment().format("YYYY.MM.D(dddd)")}</DateText>
          <TimeText>
            {moment(`${hour}:${minute}`, "HH:mm:ss").format("HH:mm:ss")}
          </TimeText>
        </TimeContainer>

        <ObserverContainer>
          <TouchableOpacity onPress={goToObserver}>
            <ObserverText>감시자:</ObserverText>
          </TouchableOpacity>
          {route.params?.observers
            ? route.params?.observers?.map((observer, index) => (
                <Observer key={index}>{`${observer?.username}`} </Observer>
              ))
            : meData?.isMe?.observers?.map((observer, index) => (
                <Observer key={index}>{`${observer?.username}`} </Observer>
              ))}
        </ObserverContainer>
        <GotoStudyBtn>
          <LinearGradient
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: screenXY.width,
              height: 70,
              borderRadius: 13,
            }}
            colors={[theme.txtColor, theme.activeColor]}
          >
            <GotoStudyText>다음 공부 하러가기</GotoStudyText>
          </LinearGradient>
        </GotoStudyBtn>
        <WeekStudy>이번주 공부량</WeekStudy>
        <WeekContainer>
          {weekName.map((value, index) => (
            <WeekEntry
              key={index}
              index={index}
              day={value}
              date={
                weekData?.seeTimes[index]
                  ? weekData.seeTimes[index].updatedAt
                  : "0"
              }
              hours={
                weekData?.seeTimes[index]
                  ? weekData?.seeTimes[index]?.timeValue
                  : 0
              }
              nums={
                weekData?.seeTimes[index]
                  ? weekData?.seeTimes[index]?.timeNumber
                  : 0
              }
            />
          ))}
        </WeekContainer>
      </HomeLayout>
    </ScrollView>
  );
}

const Logo = styled.Image`
  max-width: 100%;
  width: 100%;
  height: 130px;
`;

const RankText = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-weight: bold;
  font-size: 16px;
`;

const TimeContainer = styled.View`
  margin-top: 40px;
  width: ${screenXY.width}px;
  height: 106px;
  background-color: ${(props) => props.theme.txtColor};
  border-radius: 13px;
  align-items: center;
  justify-content: center;
`;
const DateText = styled.Text`
  color: ${(props) => props.theme.bgColor};
`;
const TimeText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  height: 75px;
  font-size: 48px;
  line-height: 56px;
  text-align: center;
`;

const ObserverContainer = styled.View`
  flex-direction: row;
  margin-top: 40px;
`;
const ObserverText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${(props) => props.theme.txtColor};
`;
const Observer = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${(props) => props.theme.activeColor};
  /* top: 1px; // why?? */
`;

const GotoStudyBtn = styled.TouchableOpacity`
  margin-top: 30px;
`;
const GotoStudyText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  font-weight: bold;
`;

const WeekStudy = styled(ObserverText)`
  margin-top: 30px;
`;
const WeekContainer = styled.View`
  width: ${screenXY.width}px;
  height: 106px;
  background-color: ${(props) => props.theme.txtColor};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  margin-top: 10px;
`;
