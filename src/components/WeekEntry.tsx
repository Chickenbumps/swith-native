import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import styled from "styled-components/native";

interface WeekEntryProps {
  day: string;
  nums: number;
  hours: number;
}

export default function WeekEntry({ day, nums, hours }: WeekEntryProps) {
  return (
    <WeekContainer>
      <DayText>{day}</DayText>
      <HourContainer>
        <HourText>{hours}h</HourText>
      </HourContainer>
      <NumText>{nums}회</NumText>
    </WeekContainer>
  );
}

const styles = StyleSheet.create({
  weekContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
});

const WeekContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 7px;
`;

const DayText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  font-size: 17px;
  font-weight: bold;
`;

const HourContainer = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 5px;
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
`;
const HourText = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-weight: bold;
`;

const NumText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  font-weight: bold;
`;
