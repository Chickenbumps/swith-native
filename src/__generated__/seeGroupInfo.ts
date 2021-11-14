/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeGroupInfo
// ====================================================

export interface seeGroupInfo_seeGroupInfo_members {
  __typename: "User";
  username: string;
  avatar: string;
}

export interface seeGroupInfo_seeGroupInfo_inviter_user {
  __typename: "User";
  username: string;
  avatar: string;
}

export interface seeGroupInfo_seeGroupInfo_inviter {
  __typename: "Inviter";
  user: seeGroupInfo_seeGroupInfo_inviter_user;
}

export interface seeGroupInfo_seeGroupInfo {
  __typename: "Group";
  title: string;
  description: string | null;
  members: (seeGroupInfo_seeGroupInfo_members | null)[];
  inviter: seeGroupInfo_seeGroupInfo_inviter | null;
  groupAvatar: string | null;
  memberNum: number | null;
  createdAt: string;
}

export interface seeGroupInfo {
  seeGroupInfo: seeGroupInfo_seeGroupInfo;
}

export interface seeGroupInfoVariables {
  id: number;
}
