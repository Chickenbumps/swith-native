import React from "react";
import styled from "styled-components/native";
import moment from "moment";

interface WeekEntryProps {
  index: number;
  day: string;
  date: string;
  nums: number;
  hours: number;
}

export default function WeekEntry({
  index,
  day,
  date,
  nums,
  hours,
}: WeekEntryProps) {
  const currentDate = moment()
    .subtract(moment().day() - index, "days")
    .format("YYYYMMDD");
  const isEqual = currentDate === date;
  const monthDay = moment()
    .subtract(moment().day() - index, "days")
    .format("MM/DD");
  return (
    <WeekContainer>
      <DateText>{monthDay}</DateText>
      <DayText>{day}</DayText>
      <HourContainer>
        <HourText>{isEqual ? hours : 0}h</HourText>
      </HourContainer>
      <NumText>{isEqual ? nums : 0}회</NumText>
    </WeekContainer>
  );
}

const WeekContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 3px;
`;

const DayText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  font-size: 17px;
  font-weight: bold;
`;

const DateText = styled(DayText)`
  font-size: 10px;
`;

const HourContainer = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 5px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
`;
const HourText = styled.Text`
  color: ${(props) => props.theme.txtColor};
  font-size: 12px;
  font-weight: bold;
`;

const NumText = styled.Text`
  color: ${(props) => props.theme.bgColor};
  font-weight: bold;
`;
