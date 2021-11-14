/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: kickMember
// ====================================================

export interface kickMember_kickMember {
  __typename: "KickMemberResult";
  ok: boolean;
  kickedUserId: number;
  error: string | null;
}

export interface kickMember {
  kickMember: kickMember_kickMember;
}

export interface kickMemberVariables {
  groupId: number;
  memberId: number;
}
