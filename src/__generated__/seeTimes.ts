/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeTimes
// ====================================================

export interface seeTimes_seeTimes {
  __typename: "Time";
  id: number;
  timeValue: number;
  dayName: string;
  updatedAt: string;
}

export interface seeTimes {
  seeTimes: seeTimes_seeTimes[];
}

export interface seeTimesVariables {
  to: string;
  from: string;
}
