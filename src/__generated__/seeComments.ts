/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeComments
// ====================================================

export interface seeComments_seeComments_user {
  __typename: "User";
  avatar: string;
  username: string;
}

export interface seeComments_seeComments {
  __typename: "Comment";
  id: number;
  payload: string;
  user: seeComments_seeComments_user;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
  range: string;
}

export interface seeComments {
  seeComments: seeComments_seeComments[];
}

export interface seeCommentsVariables {
  userId: number;
  offset: number;
}
