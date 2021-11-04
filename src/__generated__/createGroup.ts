/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createGroup
// ====================================================

export interface createGroup_createGroup {
  __typename: "CreateGroupResult";
  ok: boolean;
  error: string | null;
}

export interface createGroup {
  createGroup: createGroup_createGroup;
}

export interface createGroupVariables {
  title: string;
  description?: string | null;
}
