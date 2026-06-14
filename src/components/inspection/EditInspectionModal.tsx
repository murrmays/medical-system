import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Radio,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  editInspection,
  type InspectionEditRequest,
  type InspectionResponse,
} from "../../api/inspection";
import { searchIcdRoots } from "../../api/dictionary";
import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useDebouncedValue } from "@mantine/hooks";
import { DiagnosisSelect } from "./DiagnosisSelect";

const diagnosisSchema = z.object({
  icdDiagnosisId: z.string().min(1, "Выберите диагноз"),
  description: z.string().optional(),
  type: z.enum(["Main", "Concomitant", "Complication"]),
});
const editInspectionSchema = z
  .object({
    anamnesis: z.string().min(1, "Укажите анамнез"),
    complaints: z.string().min(1, "Укажите жалобы"),
    treatment: z.string().min(1, "Укажите рекомендации"),
    conclusion: z.enum(["Disease", "Recovery", "Death"]),
    nextVisitDate: z.date().nullable().optional(),
    deathDate: z.date().nullable().optional(),
    diagnoses: z.array(diagnosisSchema).min(1, "Укажите хотя бы один диагноз"),
  })
  .superRefine((data, ctx) => {
    if (data.diagnoses.filter((d) => d.type === "Main").length !== 1) {
      ctx.addIssue({
        code: "custom",
        message: "Должен быть один основной диагноз",
        path: ["diagnoses"],
      });
    }
    if (data.conclusion === "Disease" && !data.nextVisitDate) {
      ctx.addIssue({
        code: "custom",
        message: "Укажите дату визита",
        path: ["nextVisitDate"],
      });
    }
    if (data.conclusion === "Death" && !data.deathDate) {
      ctx.addIssue({
        code: "custom",
        message: "Укажите дату смерти",
        path: ["deathDate"],
      });
    }
  });

type EditInspectionValues = z.infer<typeof editInspectionSchema>;

interface EditInspectionProps {
  opened: boolean;
  onClose: () => void;
  inspection: InspectionResponse;
}

export const EditInspectionModal = ({
  opened,
  onClose,
  inspection,
}: EditInspectionProps) => {
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  const { data: icdData, isFetching } = useQuery({
    queryKey: ["icd-search", debouncedSearch],
    queryFn: () => searchIcdRoots({ request: debouncedSearch }),
    enabled: opened,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditInspectionValues>({
    resolver: zodResolver(editInspectionSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "diagnoses",
  });
  const currentConclusion = watch("conclusion");

  const diagnosisCodes = useMemo(
    () => inspection?.diagnoses.map((d) => d.code) || [],
    [inspection?.id],
  );

  const diagnosisDetails = useQueries({
    queries: diagnosisCodes.map((code) => ({
      queryKey: ["icd-search", code],
      queryFn: () => searchIcdRoots({ request: code }),
      enabled: !!opened && !!code,
      staleTime: Infinity,
    })),
  });

  const isDetailsLoading = diagnosisDetails.some((q) => q.isLoading);

  const codeToIdMap = useMemo(() => {
    const map: Record<string, string> = {};
    diagnosisDetails.forEach((query) => {
      if (query.data?.records?.[0]) {
        const record = query.data.records[0];
        map[record.code] = record.id;
      }
    });
    return map;
  }, [diagnosisDetails]);

  const [initializedId, setInitializedId] = useState<string | null>(null);

  useEffect(() => {
    if (!opened) {
      setInitializedId(null);
      return;
    }

    if (inspection && !isDetailsLoading && initializedId !== inspection.id) {
      const formattedDiagnoses = inspection.diagnoses.map((d) => ({
        icdDiagnosisId: codeToIdMap[d.code] || d.id,
        description: d.description || "",
        type: d.type as any,
      }));

      reset({
        anamnesis: inspection.anamnesis,
        complaints: inspection.complaints,
        treatment: inspection.treatment,
        conclusion: inspection.conclusion,
        nextVisitDate: inspection.nextVisitDate
          ? new Date(inspection.nextVisitDate)
          : null,
        deathDate: inspection.deathDate ? new Date(inspection.deathDate) : null,
        diagnoses: formattedDiagnoses,
      });

      setInitializedId(inspection.id);
    }
  }, [opened, inspection, isDetailsLoading, codeToIdMap, reset, initializedId]);

  const mutation = useMutation({
    mutationFn: (data: EditInspectionValues) => {
      const payload: InspectionEditRequest = {
        ...data,
        nextVisitDate:
          data.conclusion === "Disease"
            ? data.nextVisitDate?.toISOString()
            : undefined,
        deathDate:
          data.conclusion === "Death"
            ? data.deathDate?.toISOString()
            : undefined,
        diagnoses: data.diagnoses.map((d) => ({
          icdDiagnosisId: d.icdDiagnosisId,
          description: d.description || "",
          type: d.type,
        })),
      };
      return editInspection(inspection.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inspection", inspection.id],
      });
      onClose();
    },
    onError: (error: any) => alert(error.response?.data?.message),
  });

  const onSubmit = (data: EditInspectionValues) => {
    mutation.mutate(data);
  };
  const isReady = initializedId === inspection?.id;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Редактирование осмотра"
      size="lg"
      padding="lg"
      centered
    >
      {!isReady ? (
        <Center h={200}>
          <Loader size="md" />
        </Center>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Textarea
              label="Жалобы"
              {...register("complaints")}
              autosize
              error={errors.complaints?.message}
            />
            <Textarea
              label="Анамнез заболевания"
              {...register("anamnesis")}
              error={errors.anamnesis?.message}
              autosize
            />
            <Textarea
              label="Рекомендации по лечению"
              {...register("treatment")}
              error={errors.treatment?.message}
              autosize
            />

            <Stack>
              <Text size="sm" fw={500}>
                Диагнозы
              </Text>
              {fields.map((field, index) => (
                <Paper key={field.id} withBorder p="xs">
                  <Stack gap="xs">
                    <DiagnosisSelect
                      index={index}
                      control={control}
                      errors={errors}
                      icdData={icdData}
                      isFetching={isFetching}
                      onSearch={setSearchValue}
                      diagnosisDetails={diagnosisDetails}
                    />
                    <Controller
                      name={`diagnoses.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <Radio.Group {...field} label="Тип диагноза">
                          <Group mt="xs">
                            <Radio value="Main" label="Основной" />
                            <Radio value="Concomitant" label="Сопутствующий" />
                            <Radio value="Complication" label="Осложнение" />
                          </Group>
                        </Radio.Group>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        onClick={() => remove(index)}
                        leftSection={<Trash2 size={14} />}
                      >
                        Удалить
                      </Button>
                    )}
                  </Stack>
                </Paper>
              ))}

              <Button
                variant="light"
                size="xs"
                onClick={() =>
                  append({ icdDiagnosisId: "", type: "Concomitant" })
                }
              >
                + Добавить диагноз
              </Button>
              {errors.diagnoses && (
                <span className="error-message">
                  {errors.diagnoses.root?.message}
                </span>
              )}
            </Stack>

            <Group grow align="flex-start">
              <Controller
                name="conclusion"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Заключение"
                    data={[
                      { value: "Disease", label: "Болезнь" },
                      { value: "Recovery", label: "Выздоровление" },
                      { value: "Death", label: "Смерть" },
                    ]}
                  />
                )}
              />
              {currentConclusion === "Disease" && (
                <Controller
                  name="nextVisitDate"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <DateInput
                      {...rest}
                      label="Дата следующего визита"
                      valueFormat="DD.MM.YYYY HH:mm"
                      value={value || null}
                      onChange={(val) => {
                        onChange(val ? new Date(val) : null);
                      }}
                      error={errors.nextVisitDate?.message}
                    />
                  )}
                />
              )}
              {currentConclusion === "Death" && (
                <Controller
                  name="deathDate"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <DateInput
                      {...rest}
                      label="Дата смерти"
                      valueFormat="DD.MM.YYYY HH:mm"
                      value={value || null}
                      onChange={(val) => {
                        onChange(val ? new Date(val) : null);
                      }}
                      error={errors.deathDate?.message}
                    />
                  )}
                />
              )}
            </Group>

            <Button
              type="submit"
              className="save-inspection-btn"
              fullWidth
              mt="xl"
              loading={mutation.isPending}
            >
              Сохранить изменения
            </Button>
          </Stack>
        </form>
      )}
    </Modal>
  );
};
