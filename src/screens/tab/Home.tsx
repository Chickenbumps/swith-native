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

const SEE_TIMES_QUERY = gql`
  query seeTimes($to: String!, $from: String!) {
    seeTimes(to: $to, from: $from) {
      id
      timeValue
      dayName
      updatedAt
    }
  }
`;

export default function Home() {
  const theme = useSelectTheme();
  const { data } = useUser();

  const { data: daysData, error } = useQuery<seeTimes, seeTimesVariables>(
    SEE_TIMES_QUERY,
    {
      variables: {
        to: moment().subtract(7, "days").format("YYYYMMDD"),
        from: moment().subtract(1, "days").format("YYYYMMDD"),
      },
    }
  );

  const test = moment().subtract(7, "days").format("YYYYMMDD");

  console.log(moment());
  const hour = Math.floor(data?.isMe?.todayTime ? data?.isMe?.todayTime : 0);
  const minute =
    ((data?.isMe?.todayTime ? data?.isMe?.todayTime : 0) - hour) * 60;

  return (
    <HomeLayout>
      <Logo
        source={require("../../../assets/image/logo.png")}
        resizeMode="contain"
      />
      <RankText>현재 랭크:</RankText>
      <Rank rank={data?.isMe ? data.isMe.rank : "Bronze"}>
        {data?.isMe?.rank}
      </Rank>
      <ExpBar
        step={data?.isMe?.exp ? data.isMe.exp : 0}
        steps={data?.isMe?.maxExp ? data.isMe.maxExp : 10}
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
        <Observer>댕댕이</Observer>
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
        <WeekEntry day={"일"} hours={4.5} nums={9} />
        <WeekEntry day={"월"} hours={1} nums={4} />
        <WeekEntry day={"화"} hours={2} nums={6} />
        <WeekEntry day={"수"} hours={2.5} nums={3} />
        <WeekEntry day={"목"} hours={3.5} nums={4} />
        <WeekEntry day={"금"} hours={4} nums={4} />
        <WeekEntry day={"토"} hours={2} nums={2} />
      </LastweekContainer>
    </HomeLayout>
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
