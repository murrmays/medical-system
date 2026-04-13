import { Button, Textarea, Group, Stack } from "@mantine/core";
import { useState } from "react";

interface Props {
  initialValue?: string;
  submitLabel: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const CommentForm = ({
  initialValue = "",
  submitLabel,
  onSubmit,
  onCancel,
  loading,
}: Props) => {
  const [val, setVal] = useState(initialValue);

  return (
    <Stack gap="xs" mt="sm">
      <Textarea
        value={val}
        onChange={(e) => setVal(e.currentTarget.value)}
        placeholder="Введите текст комментария..."
        minRows={2}
        autosize
      />
      <Group justify="flex-end">
        <Button variant="subtle" size="xs" color="gray" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          size="xs"
          onClick={() => onSubmit(val)}
          loading={loading}
          disabled={!val.trim()}
          color="var(--med-accent)"
        >
          {submitLabel}
        </Button>
      </Group>
    </Stack>
  );
};
