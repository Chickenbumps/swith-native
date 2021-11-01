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
  updatedAt: string;
  dayName: string;
}

export interface isMe_isMe_observers {
  __typename: "User";
  id: number;
  username: string;
  avatar: string;
}

export interface isMe_isMe_subjects {
  __typename: "User";
  id: number;
  username: string;
  avatar: string;
}

export interface isMe_isMe {
  __typename: "User";
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string | null;
  rank: string | null;
  exp: number | null;
  maxExp: number | null;
  todayTime: number | null;
  weekTime: number | null;
  monthTime: number | null;
  totalTime: number | null;
  totalNumberOfTime: number | null;
  timePerNumber: number | null;
  numberPerTime: number | null;
  time: isMe_isMe_time[];
  observers: isMe_isMe_observers[];
  subjects: isMe_isMe_subjects[];
  totalFollowers: number;
  totalFollowing: number;
  isFollowing: boolean;
}

export interface isMe {
  isMe: isMe_isMe;
}
