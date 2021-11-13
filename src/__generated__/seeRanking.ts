/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeRanking
// ====================================================

export interface seeRanking_seeRanking {
  __typename: "User";
  id: number;
  avatar: string;
  username: string;
  rank: string | null;
  todayTime: number | null;
  weekTime: number | null;
  monthTime: number | null;
  totalTime: number | null;
}

export interface seeRanking {
  seeRanking: seeRanking_seeRanking[];
}

export interface seeRankingVariables {
  rank?: boolean | null;
  todayTime?: boolean | null;
  weekTime?: boolean | null;
  monthTime?: boolean | null;
  totalTime?: boolean | null;
}
