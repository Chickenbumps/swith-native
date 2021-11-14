/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: joinGroup
// ====================================================

export interface joinGroup_joinGroup {
  __typename: "JoinGroupResult";
  ok: boolean;
  error: string | null;
}

export interface joinGroup {
  joinGroup: joinGroup_joinGroup;
}

export interface joinGroupVariables {
  groupId: number;
}
