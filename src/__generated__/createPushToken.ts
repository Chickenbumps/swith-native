/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createPushToken
// ====================================================

export interface createPushToken_createPushToken {
  __typename: "CreatePushTokenResult";
  ok: boolean;
  error: string | null;
}

export interface createPushToken {
  createPushToken: createPushToken_createPushToken;
}

export interface createPushTokenVariables {
  pushToken?: string | null;
}
