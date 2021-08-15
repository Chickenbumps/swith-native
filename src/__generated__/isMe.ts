/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: isMe
// ====================================================

export interface isMe_isMe_time {
  __typename: "Time";
  id: number;
  timeValue: number;
  updatedAt: any;
  dayName: string;
}

export interface isMe_isMe {
  __typename: "User";
  id: number;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  rank: string | null;
  exp: number | null;
  maxExp: number | null;
  todayTime: number | null;
  weekTime: number | null;
  monthTime: number | null;
  totalTime: number | null;
  time: isMe_isMe_time[] | null;
}

export interface isMe {
  isMe: isMe_isMe;
}
