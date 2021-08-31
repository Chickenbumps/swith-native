/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeMessage
// ====================================================

export interface seeMessage_seeMessage_user {
  __typename: "User";
  id: number;
  username: string;
  avatar: string | null;
}

export interface seeMessage_seeMessage {
  __typename: "Message";
  id: number;
  payload: string;
  user: seeMessage_seeMessage_user;
  createdAt: any;
  read: boolean | null;
}

export interface seeMessage {
  seeMessage: (seeMessage_seeMessage | null)[];
}

export interface seeMessageVariables {
  groupId: number;
  offset: number;
}
