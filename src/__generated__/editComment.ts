/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editComment
// ====================================================

export interface editComment_editComment {
  __typename: "EditCommentResult";
  ok: boolean;
  error: string | null;
}

export interface editComment {
  editComment: editComment_editComment;
}

export interface editCommentVariables {
  id: number;
  payload: string;
  range: string;
}
