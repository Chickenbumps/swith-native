/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: pushNotification
// ====================================================

export interface pushNotification_pushNotification {
  __typename: "PushNotificationResult";
  ok: boolean;
  message: any | null;
  error: string | null;
}

export interface pushNotification {
  pushNotification: pushNotification_pushNotification;
}

export interface pushNotificationVariables {
  username?: string | null;
}
