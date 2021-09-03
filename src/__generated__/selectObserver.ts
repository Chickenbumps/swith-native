/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: selectObserver
// ====================================================

export interface selectObserver_selectObserver_user {
  __typename: "User";
  id: number;
  username: string;
  avatar: string | null;
  isObserver: boolean;
}

export interface selectObserver_selectObserver {
  __typename: "SelectObserverResult";
  ok: boolean;
  user: selectObserver_selectObserver_user | null;
  error: string | null;
}

export interface selectObserver {
  selectObserver: selectObserver_selectObserver;
}

export interface selectObserverVariables {
  username: string;
}
