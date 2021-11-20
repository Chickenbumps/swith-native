/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: exitGroup
// ====================================================

export interface exitGroup_exitGroup {
  __typename: "ExitGroupResult";
  ok: boolean;
  error: string | null;
}

export interface exitGroup {
  exitGroup: exitGroup_exitGroup;
}

export interface exitGroupVariables {
  groupId: number;
  memberId: number;
}
