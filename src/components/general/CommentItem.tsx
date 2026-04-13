import { Text, Group, Stack, Button, Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { CommentForm } from "./CommentForm";
import type { CommentWithChildren } from "../../utils/CommentTreeBuilder";

interface Props {
  comment: CommentWithChildren;
  currentUserId?: string;
  onAddReply: (parentId: string, content: string) => void;
  onEdit: (id: string, content: string) => void;
}

export const CommentItem = ({
  comment,
  currentUserId,
  onAddReply,
  onEdit,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showChildren, { toggle }] = useDisclosure(false);

  const isAuthor = currentUserId === comment.authorId;
  const wasModified = comment.modifiedDate !== comment.createTime;

  return (
    <div
      className="comment-node"
      style={{
        marginLeft: comment.parentId ? 20 : 0,
        borderLeft: comment.parentId ? "1px solid #eee" : "none",
        paddingLeft: comment.parentId ? 15 : 0,
      }}
    >
      <Stack gap={4} mb="md">
        <Group justify="space-between">
          <Text size="sm" fw={700}>
            {comment.author}
          </Text>
          <Text size="xs" c="dimmed">
            {new Date(comment.createTime).toLocaleString()}
          </Text>
        </Group>

        {isEditing ? (
          <CommentForm
            initialValue={comment.content}
            submitLabel="Сохранить"
            onCancel={() => setIsEditing(false)}
            onSubmit={(val) => {
              onEdit(comment.id, val);
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            <Text size="sm">
              {comment.content}
              {wasModified && (
                <Text
                  span
                  c="var(--med-accent)"
                  size="xs"
                  ml="xs"
                  style={{ cursor: "help" }}
                >
                  (изменено: {new Date(comment.modifiedDate).toLocaleString()})
                </Text>
              )}
            </Text>

            <Group gap="xs" mt={4}>
              {!isReplying && (
                <Button
                  variant="subtle"
                  size="compact-xs"
                  onClick={() => setIsReplying(true)}
                  color="var(--med-accent)"
                >
                  Ответить
                </Button>
              )}
              {isAuthor && (
                <Button
                  variant="subtle"
                  size="compact-xs"
                  color="orange"
                  onClick={() => setIsEditing(true)}
                >
                  Изменить
                </Button>
              )}
              {comment.children.length > 0 && (
                <Button
                  variant="subtle"
                  size="compact-xs"
                  onClick={toggle}
                  color="var(--med-accent)"
                >
                  {showChildren
                    ? "Скрыть ответы"
                    : `Показать ответы (${comment.children.length})`}
                </Button>
              )}
            </Group>
          </>
        )}

        {isReplying && (
          <CommentForm
            submitLabel="Оставить комментарий"
            onCancel={() => setIsReplying(false)}
            onSubmit={(val) => {
              onAddReply(comment.id, val);
              setIsReplying(false);
              if (!showChildren) toggle();
            }}
          />
        )}

        <Collapse in={showChildren}>
          <div className="replies" style={{ marginTop: 10 }}>
            {comment.children.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                currentUserId={currentUserId}
                onAddReply={onAddReply}
                onEdit={onEdit}
              />
            ))}
          </div>
        </Collapse>
      </Stack>
    </div>
  );
};
