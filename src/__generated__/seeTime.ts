/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeTime
// ====================================================

export interface seeTime_seeTime {
  __typename: "Time";
  id: number;
  timeValue: number;
  dayName: string;
  updatedAt: string;
}

export interface seeTime {
  seeTime: seeTime_seeTime;
}

export interface seeTimeVariables {
  day: string;
}
