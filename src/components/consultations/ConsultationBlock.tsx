import { Text, Stack, Divider } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../../api/doctor";
import { buildCommentTree } from "../../utils/CommentTreeBuilder";
import { CommentItem } from "../general/CommentItem";
import {
  addComment,
  editComment,
  getConsultation,
} from "../../api/consultation";
import "./ConsultationBlock.css";

interface Props {
  consultation: any;
  inspectionAuthorId: string;
}

export const ConsultationBlock = ({ consultation }: Props) => {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const { data: consultationDetails } = useQuery({
    queryKey: ["consultation", consultation.id],
    queryFn: () => getConsultation(consultation.id),
  });

  const addMutation = useMutation({
    mutationFn: (vars: { content: string; parentId?: string }) =>
      addComment(consultation.id, vars.content, vars.parentId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inspection"] }),
  });

  const editMutation = useMutation({
    mutationFn: (vars: { id: string; content: string }) =>
      editComment(vars.id, vars.content),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inspection"] }),
  });

  const commentTree = buildCommentTree(consultationDetails?.comments || []);

  return (
    <div className="consultation-card">
      <Stack>
        <span className="section-card-title">Консультация</span>
        <p>
          <b>Специализация консультанта:</b> {consultation.speciality.name}
        </p>
      </Stack>

      <Divider my="md" label="Комментарии" labelPosition="center" />

      <Stack gap="lg">
        {commentTree.length > 0 ? (
          commentTree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={profile?.id}
              onAddReply={(parentId, content) =>
                addMutation.mutate({ content, parentId })
              }
              onEdit={(id, content) => editMutation.mutate({ id, content })}
            />
          ))
        ) : (
          <Text size="sm" c="dimmed" ta="center" py="sm">
            Комментариев пока нет
          </Text>
        )}
      </Stack>
    </div>
  );
};
