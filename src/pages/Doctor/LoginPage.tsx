import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginDoctor } from "../../api/doctor";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { useState } from "react";
import { Text } from "@mantine/core";

const loginSchema = z.object({
  email: z.email("Введите корректную почту").min(1, "Введите почту"),
  password: z
    .string()
    .min(6, "Пароль должен иметь минимум 6 символов")
    .regex(/\d/, "Пароль должен содержать хотя бы одну цифру"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );

  const mutation = useMutation({
    mutationFn: loginDoctor,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      console.log(data.token);
      setSubmitStatus("success");
      navigate("/profile");
    },
    onError: () => {
      setSubmitStatus("error");
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="auth-page-root">
      <div className="auth-wrapper">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <h2>Вход</h2>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              {...register("email")}
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
          {submitStatus === "error" && (
            <Text mt="sm" ta="center" fw={500} className="error-message">
              Неверный логин или пароль
            </Text>
          )}

          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Вход..." : "Войти"}
          </button>

          <button
            className="switch-btn"
            onClick={() => navigate("/registration")}
          >
            Еще нет аккаунта? Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
};
