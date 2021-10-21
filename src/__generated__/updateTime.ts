/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateTime
// ====================================================

export interface updateTime_updateTime {
  __typename: "UpdateTimeResult";
  ok: boolean;
  error: string | null;
}

export interface updateTime {
  updateTime: updateTime_updateTime;
}

export interface updateTimeVariables {
  time: number;
}
