import styled from "styled-components/native";

interface rankProps {
  rank: string | null;
}
export const Rank = styled.Text<rankProps>`
  padding-top: 15px;
  color: ${(props) =>
    props.rank == "Bronze"
      ? "#7c441c"
      : props.rank === "Silver"
      ? "#A7A7AD"
      : props.rank === "Gold"
      ? "#e6d822"
      : "#3cf597"};
  font-size: 16px;
  font-weight: bold;
`;
