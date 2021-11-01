/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeProfile
// ====================================================

export interface seeProfile_seeProfile_comments {
  __typename: "Comment";
  id: number;
  payload: string;
  createdAt: string;
  updatedAt: string;
}

export interface seeProfile_seeProfile {
  __typename: "User";
  id: number;
  username: string;
  avatar: string;
  bio: string | null;
  totalFollowers: number;
  totalFollowing: number;
  isFollowing: boolean;
  comments: seeProfile_seeProfile_comments[];
}

export interface seeProfile {
  seeProfile: seeProfile_seeProfile;
}

export interface seeProfileVariables {
  username: string;
}
