import type { CommentResponse } from "../api/consultation";

export interface CommentWithChildren extends CommentResponse {
  children: CommentWithChildren[];
}

export const buildCommentTree = (
  flatComments: CommentResponse[],
): CommentWithChildren[] => {
  const map = new Map<string, CommentWithChildren>();
  const roots: CommentWithChildren[] = [];

  flatComments.forEach((comment) => {
    map.set(comment.id, { ...comment, children: [] });
  });

  flatComments.forEach((comment) => {
    const node = map.get(comment.id)!;
    if (
      comment.parentId &&
      comment.parentId !== "" &&
      comment.parentId !== "00000000-0000-0000-0000-000000000000"
    ) {
      const parent = map.get(comment.parentId);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};
