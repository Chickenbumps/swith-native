/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeGroups
// ====================================================

export interface seeGroups_seeGroups_members_observers {
  __typename: "User";
  id: number;
  username: string;
}

export interface seeGroups_seeGroups_members {
  __typename: "User";
  id: number;
  username: string;
  avatar: string | undefined;
  isObserver: boolean;
  observers: seeGroups_seeGroups_members_observers[];
}

export interface seeGroups_seeGroups_inviter_user {
  __typename: "User";
  id: number;
  username: string;
}

export interface seeGroups_seeGroups_inviter {
  __typename: "Inviter";
  id: number;
  user: seeGroups_seeGroups_inviter_user;
}

export interface seeGroups_seeGroups {
  __typename: "Group";
  id: number;
  title: string;
  description: string;
  members: seeGroups_seeGroups_members[];
  inviter: seeGroups_seeGroups_inviter;
}

export interface seeGroups {
  seeGroups: seeGroups_seeGroups[];
}
