/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: followToggle
// ====================================================

export interface followToggle_followToggle {
  __typename: "FollowToggleResult";
  ok: boolean;
  result: string | null;
}

export interface followToggle {
  followToggle: followToggle_followToggle;
}

export interface followToggleVariables {
  username: string;
}
