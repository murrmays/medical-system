import { zodResolver } from "@hookform/resolvers/zod";
import { Group, Radio, Select, Stack, Switch, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mars, Venus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import z from "zod";
import { getSpecialities, searchIcdRoots } from "../../api/dictionary";
import {
  createPatientInspection,
  getPatient,
  searchPatientInspections,
} from "../../api/patient";
import { useDebouncedValue } from "@mantine/hooks";
import "./CreateInspection.css";

const diagnosisSchema = z.object({
  icdDiagnosisId: z.string().min(1, "Выберите диагноз"),
  description: z.string().optional(),
  type: z.enum(["Main", "Concomitant", "Complication"]),
});

const consultationSchema = z.object({
  specialityId: z.string().min(1, "Укажите специализацию"),
  comment: z.string().min(1, "Комментарий обязателен"),
});

const createInspectionSchema = z
  .object({
    date: z
      .date()
      .refine((d) => d <= new Date(), "Дата не может быть в будущем"),
    anamnesis: z.string().min(1, "Укажите анамнез"),
    complaints: z.string().min(1, "Укажите жалобы"),
    treatment: z.string().min(1, "Укажите рекомендации"),
    conclusion: z.enum(["Disease", "Recovery", "Death"]),
    nextVisitDate: z.date().nullable().optional(),
    deathDate: z.date().nullable().optional(),
    isRepeated: z.boolean().optional(),
    previousInspectionId: z.string().optional(),
    diagnoses: z.array(diagnosisSchema).min(1, "Укажите хотя бы один диагноз"),
    consultations: z.array(consultationSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRepeated && !data.previousInspectionId) {
      ctx.addIssue({
        code: "custom",
        message: "Укажите предыдущий осмотр",
        path: ["previousInspectionId"],
      });
    }
    if (data.diagnoses.filter((d) => d.type === "Main").length !== 1) {
      ctx.addIssue({
        code: "custom",
        message: "Должен быть один основной диагноз",
        path: ["diagnoses"],
      });
    }
    if (data.conclusion === "Disease") {
      if (!data.nextVisitDate) {
        ctx.addIssue({
          code: "custom",
          message: "Укажите дату следующего визита",
          path: ["nextVisitDate"],
        });
      } else if (data.nextVisitDate <= new Date()) {
        ctx.addIssue({
          code: "custom",
          message: "Дата визита должна быть в будущем",
          path: ["nextVisitDate"],
        });
      }
    }
    if (data.conclusion === "Death" && !data.deathDate) {
      ctx.addIssue({
        code: "custom",
        message: "Укажите дату смерти",
        path: ["deathDate"],
      });
    }
    const specs = data.consultations?.map((c) => c.specialityId) || [];
    if (new Set(specs).size !== specs.length) {
      ctx.addIssue({
        code: "custom",
        message: "Специальности не должны повторяться",
        path: ["consultations"],
      });
    }
  });

type CreateInspectionValues = z.infer<typeof createInspectionSchema>;

export const CreateInspectionPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const patientId = location.state?.patientId;
  const parentId = location.state?.parentId;

  const [inspectionSearch, setInspectionSearch] = useState("");
  const [debouncedInspectionSearch] = useDebouncedValue(inspectionSearch, 400);

  const [isConsultationRequired, setIsConsultationRequired] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateInspectionValues>({
    resolver: zodResolver(createInspectionSchema),
    defaultValues: {
      date: new Date(),
      conclusion: "Disease",
      diagnoses: [{ icdDiagnosisId: "", description: "", type: "Main" }],
      consultations: [],
      isRepeated: !!parentId,
      previousInspectionId: parentId || undefined,
    },
  });
  const isRepeated = watch("isRepeated");

  const {
    fields: diagFields,
    append: appendDiag,
    remove: removeDiag,
  } = useFieldArray({ control, name: "diagnoses" });
  const {
    fields: consFields,
    append: appendCons,
    remove: removeCons,
  } = useFieldArray({ control, name: "consultations" });

  const currentConclusion = watch("conclusion");

  const { data: patient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatient(patientId!),
  });
  const { data: specialities, isLoading: isSpecsLoading } = useQuery({
    queryKey: ["specialities"],
    queryFn: getSpecialities,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);
  const { data: icdData, isLoading: isIcdLoading } = useQuery({
    queryKey: ["icd-search", debouncedQuery],
    queryFn: () => searchIcdRoots({ request: debouncedQuery }),
    enabled: debouncedQuery.length > 1,
  });

  const { data: previousInspections, isLoading: isInspectionsLoading } =
    useQuery({
      queryKey: ["patientInspections", patientId, debouncedInspectionSearch],
      queryFn: () =>
        searchPatientInspections(patientId!, debouncedInspectionSearch),
      enabled: isRepeated,
    });

  const mutation = useMutation({
    mutationFn: (payload: any) => createPatientInspection(patientId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patientInspections", patientId],
      });
      navigate(`/patient/${patientId}`);
    },
    onError: (error: any) => {
      console.error(error.response.data);
    },
  });

  const onSubmit = (data: CreateInspectionValues) => {
    let inspectionDate = new Date(data.date);
    const now = new Date();
    if (inspectionDate > new Date(now.getTime() - 60000))
      inspectionDate = new Date(now.getTime() - 60000);

    const formattedConsultations = data.consultations?.map((cons) => ({
      specialityId: cons.specialityId,
      comment: {
        content: cons.comment,
      },
    }));

    const payload = {
      ...data,
      date: inspectionDate.toISOString(),
      nextVisitDate: data.nextVisitDate
        ? data.nextVisitDate.toISOString()
        : undefined,
      deathDate: data.deathDate ? data.deathDate.toISOString() : undefined,
      consultations: formattedConsultations,
    };
    mutation.mutate(payload);
  };
  const onInvalid = (errors: any) => {
    console.error("Ошибка валидации формы:", errors);
  };

  return (
    <div className="create-inspec-page-root">
      <form
        className="create-inspec-wrapper"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
      >
        <section className="header-card">
          <span>
            {patient?.name}{" "}
            {patient?.gender === "Male" ? (
              <Mars className="gender-icon" />
            ) : (
              <Venus className="gender-icon" />
            )}
          </span>
          <span>
            Дата рождения:{" "}
            {patient?.birthday &&
              new Date(patient.birthday).toLocaleDateString()}
          </span>

          <Controller
            name="isRepeated"
            control={control}
            render={({ field }) => (
              <Switch
                label="Повторный осмотр"
                checked={field.value}
                color="var(--med-accent)"
                onChange={(e) => {
                  field.onChange(e.currentTarget.checked);
                  if (!e.currentTarget.checked) {
                    setValue("previousInspectionId", undefined);
                  }
                }}
              />
            )}
          />

          {isRepeated && (
            <Controller
              name="previousInspectionId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Предыдущий осмотр"
                  placeholder={
                    isInspectionsLoading
                      ? "Поиск..."
                      : "Введите диагноз для поиска"
                  }
                  data={
                    previousInspections?.map((insp: any) => ({
                      value: insp.id,
                      label: `${new Date(insp.date).toLocaleString([], { dateStyle: "short", timeStyle: "short" })} ${insp.diagnosis.code} - ${insp.diagnosis.name}`,
                    })) || []
                  }
                  error={errors.previousInspectionId?.message}
                  searchable
                  searchValue={inspectionSearch}
                  onSearchChange={setInspectionSearch}
                  filter={({ options }) => options}
                  style={{ flex: 1 }}
                />
              )}
            />
          )}
          <Controller
            name="date"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <DateInput
                {...rest}
                value={value || null}
                onChange={(val) => {
                  onChange(val ? new Date(val) : null);
                }}
                label="Дата осмотра"
                valueFormat="DD.MM.YYYY HH:mm"
                maxDate={new Date()}
                error={errors.date?.message}
              />
            )}
          />
        </section>

        <section className="medical-info">
          <Stack>
            <Textarea
              label="Жалобы"
              {...register("complaints")}
              error={errors.complaints?.message}
            />
            <Textarea
              label="Анамнез заболевания"
              {...register("anamnesis")}
              error={errors.anamnesis?.message}
            />
          </Stack>
        </section>

        <section className="consultation">
          <p>Консультация</p>
          <Switch
            className="consultation-switch"
            label="Требуется консультация"
            color="var(--med-accent)"
            checked={isConsultationRequired}
            onChange={(e) => {
              setIsConsultationRequired(e.currentTarget.checked);
              if (e.currentTarget.checked && consFields.length === 0) {
                appendCons({ specialityId: "", comment: "" });
              }
            }}
          />

          {isConsultationRequired && (
            <Stack>
              {consFields.map((field, index) => (
                <Group key={field.id} align="flex-end" wrap="nowrap">
                  <div style={{ flex: 1 }}>
                    <Controller
                      name={`consultations.${index}.specialityId`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Специализация консультанта"
                          data={
                            specialities?.map((s: any) => ({
                              value: s.id,
                              label: s.name,
                            })) || []
                          }
                          disabled={isSpecsLoading}
                          error={
                            errors.consultations?.[index]?.specialityId?.message
                          }
                          searchable
                        />
                      )}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Textarea
                      autosize
                      label="Комментарий"
                      {...register(`consultations.${index}.comment`)}
                      error={errors.consultations?.[index]?.comment?.message}
                    />
                  </div>

                  <button
                    type="button"
                    className="delete-btn-icon"
                    onClick={() => removeCons(index)}
                    disabled={consFields.length === 1}
                  >
                    <X />
                  </button>
                </Group>
              ))}
              {errors.consultations && (
                <p className="error-message">
                  {errors.consultations.root?.message ||
                    errors.consultations.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => appendCons({ specialityId: "", comment: "" })}
              >
                + Добавить консультацию
              </button>
            </Stack>
          )}
        </section>

        <section className="diagnoses">
          <Group className="diag-header" justify="space-between" align="center">
            <p className="diag-title">Диагнозы</p>
            <button
              type="button"
              onClick={() =>
                appendDiag({
                  icdDiagnosisId: "",
                  description: "",
                  type: "Concomitant",
                })
              }
            >
              + Добавить диагноз
            </button>
          </Group>

          {diagFields.map((field, index) => (
            <Stack key={field.id}>
              <Group key={field.id} align="flex-end" wrap="nowrap">
                <div style={{ flex: 1 }}>
                  <Controller
                    name={`diagnoses.${index}.icdDiagnosisId`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Болезни"
                        searchable
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        filter={({ options }) => options}
                        nothingFoundMessage={
                          isIcdLoading ? "Загрузка..." : "Ничего не найдено"
                        }
                        data={
                          icdData?.records?.map((i: any) => ({
                            value: i.id,
                            label: `${i.code} - ${i.name}`,
                          })) || []
                        }
                        error={
                          errors.diagnoses?.[index]?.icdDiagnosisId?.message
                        }
                      />
                    )}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Textarea
                    autosize
                    label="Расшифровка"
                    {...register(`diagnoses.${index}.description`)}
                  />
                </div>

                <button
                  type="button"
                  className="delete-btn-icon"
                  onClick={() => removeDiag(index)}
                  disabled={diagFields.length === 1}
                >
                  <X />
                </button>
              </Group>
              <Controller
                name={`diagnoses.${index}.type`}
                control={control}
                render={({ field }) => (
                  <Radio.Group
                    {...field}
                    label="Тип диагноза в осмотре"
                    error={errors.diagnoses?.[index]?.type?.message}
                  >
                    <Group mt="xs">
                      <Radio value="Main" label="Основной" />
                      <Radio value="Concomitant" label="Сопутствующий" />
                      <Radio value="Complication" label="Осложнение" />
                    </Group>
                  </Radio.Group>
                )}
              />
              <div className="diagnoses-divider"></div>
            </Stack>
          ))}
          {errors.diagnoses && (
            <div className="error-message">
              {errors.diagnoses.root?.message || errors.diagnoses.message}
            </div>
          )}
        </section>

        <section className="treatment">
          <Textarea
            label="Рекомендации по лечению"
            {...register("treatment")}
            error={errors.treatment?.message}
          />
        </section>

        <section className="conclusion">
          <Group grow align="flex-end">
            <Controller
              name="conclusion"
              control={control}
              render={({ field }) => (
                <Select
                  className="conclusion-select"
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
                    value={value || null}
                    onChange={(val) => {
                      onChange(val ? new Date(val) : null);
                    }}
                    label="Дата следующего визита"
                    valueFormat="DD.MM.YYYY HH:mm"
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
                    value={value || null}
                    onChange={(val) => {
                      onChange(val ? new Date(val) : null);
                    }}
                    label="Дата смерти"
                    valueFormat="DD.MM.YYYY HH:mm"
                    error={errors.deathDate?.message}
                  />
                )}
              />
            )}
          </Group>
        </section>

        <section className="form-footer">
          <button type="submit">Сохранить осмотр</button>
          <button className="cancel-btn" onClick={() => navigate(-1)}>
            Отмена
          </button>
        </section>
      </form>
    </div>
  );
};
