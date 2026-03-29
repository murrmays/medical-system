import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { z } from "zod";
import { registerDoctor } from "../../api/doctor";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { getSpecialities } from "../../api/dictionary";
import { Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";

const registerSchema = z.object({
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
  speciality: z.string().min(1, "Выберите специальность"),
  email: z.email("Введите корректную почту"),
  password: z
    .string()
    .min(6, "Пароль должен иметь минимум 6 символов")
    .regex(/\d/, "Пароль должен содержать хотя бы одну цифру"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const genderData = [
    { value: "Male", label: "Мужской" },
    { value: "Female", label: "Женский" },
  ];
  const navigate = useNavigate();
  const { data: specialities, isLoading: isSpecsLoading } = useQuery({
    queryKey: ["specialities"],
    queryFn: getSpecialities,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      birthday: "",
      speciality: "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerDoctor,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/profile");
      window.location.reload();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Ошибка регистрации");
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="auth-page-root">
      <div className="auth-wrapper">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <h2>Регистрация</h2>

          <div className="form-field">
            <label htmlFor="name">Имя</label>
            <input
              id="name"
              type="text"
              placeholder="Иванов Иван Иванович"
              {...register("name")}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="gender">Пол</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Мужской"
                  data={genderData}
                  error={errors.gender?.message}
                />
              )}
            />
          </div>

          <div className="form-field">
            <label htmlFor="birthday">Дата рождения</label>
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
                  placeholder="Выбрать"
                  valueFormat="DD.MM.YYYY"
                  maxDate={new Date()}
                  error={errors.birthday?.message}
                />
              )}
            />
          </div>

          <div className="form-field">
            <label htmlFor="phone">Номер телефона</label>
            <Controller
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  id="phone"
                  placeholder="+7 (xxx) xxx-xx-xx"
                  mask="+7 (000) 000-00-00"
                  onAccept={(value) => field.onChange(value)}
                  lazy={true}
                />
              )}
              {...register("phone")}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone.message}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="speciality">Специальность</label>
            <Controller
              name="speciality"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={isSpecsLoading ? "Загрузка..." : "Выбрать"}
                  data={
                    specialities?.map((s) => ({
                      value: s.id,
                      label: s.name,
                    })) || []
                  }
                  disabled={isSpecsLoading}
                  error={errors.speciality?.message}
                />
              )}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="example@mail.com"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              {...register("password")}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Регистрация..." : "Зарегистрироваться"}
          </button>

          <button className="switch-btn" onClick={() => navigate("/login")}>
            Уже есть аккаунт? Войти
          </button>
        </form>
      </div>
    </div>
  );
};
