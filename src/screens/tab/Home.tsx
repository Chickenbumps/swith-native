import { gql, useQuery } from "@apollo/client";
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
// import "moment/locale/en-au";
import { seeTimes, seeTimesVariables } from "../../__generated__/seeTimes";
import { ScrollView, TouchableOpacity } from "react-native";
import Medal from "../../components/Medal";

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

export default function Home() {
  const theme = useSelectTheme();
  const { data: userData } = useUser();

  const { data: weekData } = useQuery<seeTimes, seeTimesVariables>(
    SEE_TIMES_QUERY,
    {
      variables: {
        to: moment().subtract(7, "days").format("YYYYMMDD"),
        from: moment().subtract(1, "days").format("YYYYMMDD"),
      },
    }
  );
  const dtime = moment().format("YYYY-MM-DD");
  // console.log(moment().format("YYYY-MM-DD"));

  const weekName = ["일", "월", "화", "수", "목", "금", "토"];
  const test = moment().subtract(7, "days").format("YYYYMMDD");
  const hour = Math.floor(
    userData?.isMe?.todayTime ? userData?.isMe?.todayTime : 0
  );
  const minute =
    ((userData?.isMe?.todayTime ? userData?.isMe?.todayTime : 0) - hour) * 60;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgColor }}>
      <HomeLayout>
        <RankText>현재 랭크:</RankText>
        <Rank rank={userData?.isMe ? userData.isMe.rank : "Bronze"}>
          {userData?.isMe?.rank}
        </Rank>
        <Medal
          maxExp={
            userData?.isMe && userData.isMe.maxExp !== null
              ? userData.isMe.maxExp
              : 0
          }
          exp={
            userData?.isMe && userData.isMe.exp !== null ? userData.isMe.exp : 0
          }
        />
        <ExpBar
          step={userData?.isMe?.exp ? userData.isMe.exp : 0}
          steps={userData?.isMe?.maxExp ? userData.isMe.maxExp : 10}
        />
        <TimeContainer>
          <DateText>{moment().format("YYYY.MM.D(dddd)")}</DateText>
          <TimeText>
            {moment(`${hour}:${minute}`, "HH:mm:ss").format("HH:mm:ss")}
          </TimeText>
        </TimeContainer>
        <GoalText
          placeholder="   오늘 다짐 한마디 적어볼까요:)"
          placeholderTextColor={theme.bgColor}
        />

        <ObserverContainer>
          <ObserverText>감시자:</ObserverText>
          <TouchableOpacity>
            <Observer>댕댕이</Observer>
          </TouchableOpacity>
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
        <LastweekContainer>
          {weekName.map((value, index) => (
            <WeekEntry
              key={index}
              day={value}
              hours={
                weekData?.seeTimes ? weekData?.seeTimes[index]?.timeValue : 0
              }
              nums={
                weekData?.seeTimes ? weekData?.seeTimes[index]?.timeNumber : 0
              }
            />
          ))}
        </LastweekContainer>
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
const GoalText = styled.TextInput`
  width: ${screenXY.width}px;
  height: 30px;
  margin-top: 40px;
  border-radius: 9px;
  color: ${(props) => props.theme.bgColor};
  background-color: ${(props) => props.theme.txtColor};
  font-weight: bold;
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
  top: 1px; // why??
`;

const GotoStudyBtn = styled.TouchableOpacity`
  margin-top: 40px;
`;
const GotoStudyText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  font-weight: bold;
`;
const LastweekContainer = styled.View`
  width: ${screenXY.width}px;
  height: 106px;
  background-color: ${(props) => props.theme.txtColor};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  margin-top: 40px;
`;
