import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { KeyboardAvoidingView, useWindowDimensions } from "react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { logUserOut } from "../../apollo";
import AuthLayout from "../../components/auth/AuthLayout";
import DismissKeyboard from "../../components/DismissKeyboard";
import ExpBar from "../../components/ExpBar";
import HomeLayout from "../../components/HomeLayout";
import ScreenLayout from "../../components/ScreenLayout";
import WeekEntry from "../../components/WeekEntry";
import { screenXY, useSelectTheme } from "../../styles";

export default function Home() {
  const theme = useSelectTheme();
  return (
    <HomeLayout>
      <Logo
        source={require("../../../assets/image/logo.png")}
        resizeMode="contain"
      />
      <RankText>현재 랭크:</RankText>
      <Rank>Bronze</Rank>
      <ExpBar step={5} steps={10} />
      <TimeContainer>
        <DateText>CurrentDate</DateText>
        <TimeText>00:00:00</TimeText>
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

const Rank = styled.Text`
  color: brown;
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
