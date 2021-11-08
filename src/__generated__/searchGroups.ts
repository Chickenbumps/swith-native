/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchGroups
// ====================================================

export interface searchGroups_searchGroups {
  __typename: "Group";
  id: number;
  title: string;
  memberNum: number | null;
  groupAvatar: string | null;
}

export interface searchGroups {
  searchGroups: searchGroups_searchGroups[];
}

export interface searchGroupsVariables {
  title: string;
}
