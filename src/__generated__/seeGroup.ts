/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeGroup
// ====================================================

export interface seeGroup_seeGroup_members {
  __typename: "User";
  id: number;
  username: string;
  avatar: string;
}

export interface seeGroup_seeGroup_messages_user {
  __typename: "User";
  id: number;
  username: string;
  avatar: string;
}

export interface seeGroup_seeGroup_messages {
  __typename: "Message";
  id: number;
  payload: string;
  user: seeGroup_seeGroup_messages_user;
  createdAt: any;
  read: boolean | null;
}

export interface seeGroup_seeGroup_inviter_user {
  __typename: "User";
  id: number;
  username: string;
}

export interface seeGroup_seeGroup_inviter {
  __typename: "Inviter";
  id: number;
  user: seeGroup_seeGroup_inviter_user;
}

export interface seeGroup_seeGroup {
  __typename: "Group";
  id: number;
  title: string;
  description: string | null;
  members: seeGroup_seeGroup_members[];
  messages: seeGroup_seeGroup_messages[];
  inviter: seeGroup_seeGroup_inviter;
}

export interface seeGroup {
  seeGroup: seeGroup_seeGroup;
}

export interface seeGroupVariables {
  id: number;
  offset: number;
}
