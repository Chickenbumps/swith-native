/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: isMe
// ====================================================

export interface isMe_isMe {
  __typename: "User";
  id: number;
  username: string | null;
  avatar: string | undefined;
  bio: string | null;
  rank: string | null;
  exp: number;
  maxExp: number;
  todayTime: number | null;
  sunday: number | null;
  monday: number | null;
  tuesday: number | null;
  wednesday: number | null;
  thursday: number | null;
  friday: number | null;
  saturday: number | null;
  weekTime: number | null;
  monthTime: number | null;
  totalTime: number | null;
}

export interface isMe {
  isMe: isMe_isMe | null;
}
