import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import WeekEntry from "../components/WeekEntry";
import ExpBar from "../components/ExpBar";
import HomeLayout from "../components/HomeLayout";
import styled from "styled-components/native";
import { screenXY, useSelectTheme } from "../styles";
import ConfirmBtn from "../components/ConfirmBtn";
import useUser from "../hooks/useUser";
import { Rank } from "../components/Rank";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { seeTimes, seeTimesVariables } from "../__generated__/seeTimes";
import moment from "moment";
import { useSpring, animated, config } from "@react-spring/native";
import Medal from "../components/Medal";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../navigation/Router";
import { reloadVar } from "../apollo";

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

type ResultScreenProps = StackScreenProps<LoggedInNavStackParamList, "Result">;

export default function Result({ route, navigation }: ResultScreenProps) {
  const theme = useSelectTheme();
  const [goals, setGoals] = useState("");
  const { data: userData, refetch, loading } = useUser();
  const weekName = ["일", "월", "화", "수", "목", "금", "토"];

  const { data: weekData, error } = useQuery<seeTimes, seeTimesVariables>(
    SEE_TIMES_QUERY,
    {
      variables: {
        to: moment().subtract(moment().day(), "days").format("YYYYMMDD"),
        from: moment().format("YYYYMMDD"),
      },
    }
  );

  const h =
    userData?.isMe.maxExp &&
    userData?.isMe?.exp &&
    Math.floor(userData?.isMe.maxExp - userData?.isMe.exp);
  const m =
    h &&
    userData?.isMe.maxExp &&
    userData?.isMe?.exp &&
    Math.round((userData?.isMe.maxExp - userData?.isMe.exp - h) * 60);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgColor }}>
      <HomeLayout color={true} loading={false}>
        <CompleteMsgContainer>
          <DurationNumberText>{route.params.duration}</DurationNumberText>
          <BaseText>분 도전 성공!</BaseText>
        </CompleteMsgContainer>
        <NextRankText>
          다음 랭크까지 {userData?.isMe.maxExp && userData?.isMe?.exp ? h : 0}
          시간 {m}분 남았어요. 힘내요!
        </NextRankText>
        <ExpBar
          step={userData?.isMe?.exp ? userData.isMe.exp : 0}
          steps={userData?.isMe?.maxExp ? userData.isMe.maxExp : 10}
        />
        <RankText>나의 랭크:</RankText>
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

        {/* <animated.Text>{number.to((n) => n.toFixed(2))}</animated.Text> */}
        {/* <Text style={[styles.text, { paddingTop: 40 }]}>이번주 성취:</Text> */}
        <PerformanceContainer>
          <View style={{ alignItems: "center" }}>
            <BaseText>시간/횟수</BaseText>
            <BaseText>
              {userData?.isMe ? userData.isMe.timePerNumber : 0}
            </BaseText>
          </View>
          <View style={{ alignItems: "center" }}>
            <BaseText>횟수/시간</BaseText>
            <BaseText>
              {userData?.isMe ? userData.isMe.numberPerTime : 0}
            </BaseText>
          </View>
          <View style={{ alignItems: "center" }}>
            <BaseText>총 공부시간</BaseText>
            <BaseText>{userData?.isMe ? userData.isMe.totalTime : 0}</BaseText>
          </View>
        </PerformanceContainer>

        {/* <View style={{ paddingTop: 50 }}> */}
        {/* <Text style={{ left: 260, color: "#FFD662", fontWeight: "bold" }}>
          단위:시간
        </Text> */}

        <LastWeekContainer>
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
        </LastWeekContainer>
        {/* </View> */}
        {/* <CommentContainer>
          <Comment
            placeholder="   도전을 성공한 자신에게 칭찬 한마디:)"
            placeholderTextColor={theme.phColor}
            onChangeText={(e) => setGoals(e)}
          />
        </CommentContainer> */}
        <ConfirmBtn onPress={() => navigation.navigate("Tab")} />
      </HomeLayout>
    </ScrollView>
  );
}

const CompleteMsgContainer = styled.View`
  flex-direction: row;
  padding-top: 60px;
`;
const BaseText = styled.Text`
  font-weight: bold;
  font-size: 20px;
  color: ${(props) => props.theme.txtColor};
`;
const DurationNumberText = styled(BaseText)`
  color: ${(props) => props.theme.activeColor};
`;

const NextRankText = styled(BaseText)`
  padding-top: 10px;
  font-size: 16px;
  font-weight: 500;
`;

const RankText = styled(BaseText)`
  padding-top: 20px;
  font-size: 16px;
`;

const PerformanceContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 50px;
`;
const LastWeekContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: ${screenXY.width}px;
  height: 106px;
  background-color: ${(props) => props.theme.txtColor};
  border-radius: 13px;
  margin-top: 40px;
`;

const CommentContainer = styled.View`
  margin-top: 40px;
`;
const Comment = styled.TextInput`
  width: ${screenXY.width}px;
  height: 37px;
  background-color: ${(props) => props.theme.txtColor};
  font-weight: bold;
  border-radius: 13px;
`;
