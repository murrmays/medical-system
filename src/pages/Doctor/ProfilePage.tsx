import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editDoctor, getProfile } from "../../api/doctor";
import "./Profile.css";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  gender: z.enum(["Male", "Female"], {
    error: () => "Выберите пол",
  }),
  birthday: z
    .string()
    .refine(
      (date) => new Date(date) < new Date(),
      "Дата рождения должна быть в прошлом",
    ),
  phone: z.string().min(18, "Введите полный номер телефона"),
  email: z.email("Введите корректную почту"),
  password: z
    .string()
    .min(6, "Пароль должен иметь минимум 6 символов")
    .regex(/\d/, "Пароль должен содержать хотя бы одну цифру"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
  const genderData = [
    { value: "Male", label: "Мужской" },
    { value: "Female", label: "Женский" },
  ];
  const formatPhone = (phone: string) => {
    const res = phone.replace(/\D/g, "");
    return `+${res[0]} (${res.slice(1, 4)}) ${res.slice(4, 7)}-${res.slice(7, 9)}-${res.slice(9, 11)}`;
  };
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        birthday: profile.birthday?.split("T")[0],
        gender: profile.gender,
      });
    }
  }, [profile, reset]);
  const mutation = useMutation({
    mutationFn: editDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
    },
  });
  const onSubmit = (data: any) => mutation.mutate(data);

  if (isLoading) return <div className="loading-screen">Загрузка...</div>;
  return (
    <div className="profile-page-root">
      <div className="profile-wrapper">
        <form className="profile-card" onSubmit={handleSubmit(onSubmit)}>
          <div className="profile-header">
            <h2>
              {isEditing ? "Редактирование профиля" : "Личный профиль врача"}
            </h2>
          </div>

          <div className="profile-grid">
            <div className="info-item full-width">
              <label>ФИО</label>
              {isEditing ? (
                <input {...register("name")} className="edit-input" />
              ) : (
                <p>{profile?.name}</p>
              )}
              {errors.name && (
                <span className="error-message">{errors.name.message}</span>
              )}
            </div>

            <div className="info-item">
              <label>Email</label>
              {isEditing ? (
                <input {...register("email")} className="edit-input" />
              ) : (
                <p>{profile?.email}</p>
              )}
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="info-item">
              <label>Дата рождения</label>
              {isEditing ? (
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      {...field}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        field.onChange(date ? date.toString() : null);
                      }}
                      placeholder={profile.birthday}
                      valueFormat="DD.MM.YYYY"
                      maxDate={new Date()}
                      className="mantine-input"
                      variant="unstyled"
                      error={errors.birthday?.message}
                    />
                  )}
                />
              ) : (
                <p>{new Date(profile?.birthday).toLocaleDateString("ru-RU")}</p>
              )}
            </div>

            <div className="info-item">
              <label>Телефон</label>
              {isEditing ? (
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      {...field}
                      className="edit-input"
                      mask="+{7} (000) 000-00-00"
                      onAccept={(value) => field.onChange(value)}
                    />
                  )}
                />
              ) : (
                <p>{formatPhone(profile?.phone)}</p>
              )}
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
            </div>

            <div className="info-item">
              <label>Пол</label>
              {isEditing ? (
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Мужской"
                      data={genderData}
                      className="mantine-input"
                      error={errors.gender?.message}
                    />
                  )}
                />
              ) : (
                <p>{profile?.gender === "Male" ? "Мужской" : "Женский"}</p>
              )}
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-buttons-group">
                <button
                  type="submit"
                  className="save-btn"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Сохранение..." : "Сохранить изменения"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                >
                  Отмена
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Редактировать данные
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
