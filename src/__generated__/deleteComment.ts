/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteComment
// ====================================================

export interface deleteComment_deleteComment {
  __typename: "DeleteCommentResult";
  ok: boolean;
  error: string | null;
}

export interface deleteComment {
  deleteComment: deleteComment_deleteComment;
}

export interface deleteCommentVariables {
  id: number;
}
