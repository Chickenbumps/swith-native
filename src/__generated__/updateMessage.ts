/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: updateMessage
// ====================================================

export interface updateMessage_updateMessage_user {
  __typename: "User";
  id: number;
  username: string;
  avatar: string | null;
}

export interface updateMessage_updateMessage {
  __typename: "Message";
  id: number;
  payload: string;
  user: updateMessage_updateMessage_user;
  createdAt: any;
  read: boolean | null;
}

export interface updateMessage {
  updateMessage: updateMessage_updateMessage | null;
}

export interface updateMessageVariables {
  groupId: number;
}
