import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

import WeekEntry from "../components/WeekEntry";
import ExpBar from "../components/ExpBar";
import HomeLayout from "../components/HomeLayout";
import styled from "styled-components/native";
import { screenXY, useSelectTheme } from "../styles";
import ConfirmBtn from "../components/ConfirmBtn";
import useUser from "../hooks/useUser";
import { isMe, isMe_isMe } from "../__generated__/isMe";
import { useEffect } from "react";

export default function Result({ route, navigation }: any) {
  const theme = useSelectTheme();
  const dayIndex = new Date().getDay();
  const [goals, setGoals] = useState("");

  const { data, refetch } = useUser();
  const leftExp = data!.isMe!.maxExp - data!.isMe!.exp;

  useEffect(() => {
    refetch();
  }, []);

  return (
    <HomeLayout>
      <CompleteMsgContainer>
        <DurationNumberText>{route.params.duration}</DurationNumberText>
        <BaseText>분 도전 성공!</BaseText>
      </CompleteMsgContainer>
      <NextRankText>
        다음 랭크까지 {leftExp}
        시간 남았어요. 힘내요!
      </NextRankText>
      <ExpBar
        step={data?.isMe?.exp ? data.isMe.exp : 0}
        steps={data?.isMe?.maxExp ? data.isMe.maxExp : 10}
      />
      <RankText>나의 랭크:</RankText>
      <Rank>{data?.isMe?.rank}</Rank>
      {/* <Text style={[styles.text, { paddingTop: 40 }]}>이번주 성취:</Text> */}
      <PerformanceContainer>
        <View style={{ alignItems: "center" }}>
          <BaseText>평균시간</BaseText>
          <BaseText>36분</BaseText>
        </View>
        <View style={{ alignItems: "center" }}>
          <BaseText>성공횟수</BaseText>
          <BaseText>36회</BaseText>
        </View>
        <View style={{ alignItems: "center" }}>
          <BaseText>전체시간</BaseText>
          <BaseText>36분</BaseText>
        </View>
      </PerformanceContainer>

      {/* <View style={{ paddingTop: 50 }}> */}
      {/* <Text style={{ left: 260, color: "#FFD662", fontWeight: "bold" }}>
          단위:시간
        </Text> */}

      <LastWeekContainer>
        <WeekEntry day={"일"} hours={4.5} nums={9} />
        <WeekEntry day={"월"} hours={1} nums={4} />
        <WeekEntry day={"화"} hours={2} nums={6} />
        <WeekEntry day={"수"} hours={2.5} nums={3} />
        <WeekEntry day={"목"} hours={3.5} nums={4} />
        <WeekEntry day={"금"} hours={4} nums={4} />
        <WeekEntry day={"토"} hours={2} nums={2} />
      </LastWeekContainer>
      {/* </View> */}
      <CommentContainer>
        <Comment
          placeholder="   도전을 성공한 자신에게 칭찬 한마디:)"
          placeholderTextColor={theme.phColor}
          onChangeText={(e) => setGoals(e)}
        />
      </CommentContainer>
      <ConfirmBtn onPress={() => navigation.navigate("Tab")} />
    </HomeLayout>
  );
}

const CompleteMsgContainer = styled.View`
  flex-direction: row;
  padding-top: 60px;
`;
const BaseText = styled.Text`
  font-weight: bold;
  font-size: 25px;
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

const Rank = styled(BaseText)`
  padding-top: 15px;
  color: brown;
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
