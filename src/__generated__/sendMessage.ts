/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: sendMessage
// ====================================================

export interface sendMessage_sendMessage {
  __typename: "SendMessageResult";
  ok: boolean;
  id: number | null;
  error: string | null;
}

export interface sendMessage {
  sendMessage: sendMessage_sendMessage;
}

export interface sendMessageVariables {
  groupId: number;
  payload: string;
}
