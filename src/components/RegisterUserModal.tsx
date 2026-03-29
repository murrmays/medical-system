import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { registerNewPatient } from "../api/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, Modal, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "./RegisterUserModal.css";

const registerUserSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  birthday: z
    .string()
    .refine(
      (date) => new Date(date) < new Date(),
      "Дата рождения должна быть в прошлом",
    ),
  gender: z.enum(["Male", "Female"], {
    error: () => "Выберите пол",
  }),
});
type RegisterUserValues = z.infer<typeof registerUserSchema>;

interface RegisterUserProps {
  opened: boolean;
  onClose: () => void;
}
export const RegisterUserModal = ({ opened, onClose }: RegisterUserProps) => {
  const queryClient = useQueryClient();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterUserValues>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      gender: "Male",
      birthday: "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerNewPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      onClose();
      reset();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message);
    },
  });
  const onSubmit = (data: RegisterUserValues) => {
    const formattedData = {
      ...data,
      birthday: new Date(data.birthday).toISOString(),
    };
    mutation.mutate(formattedData);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Регистрация нового пациента"
      centered
      size="lg"
      padding="xl"
      withinPortal={true}
      lockScroll={false}
      className="register-user-modal"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-grid">
          <div className="info-item full-width">
            <TextInput
              label="ФИО"
              placeholder="Иванов Иван Иванович"
              {...register("name")}
              error={errors.name?.message}
            />
          </div>
          <div className="info-item">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Пол"
                  data={[
                    { value: "Male", label: "Мужской" },
                    { value: "Female", label: "Женский" },
                  ]}
                  error={errors.gender?.message}
                />
              )}
            />
          </div>
          <div className="info-item">
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DateInput
                  label="Дата рождения"
                  placeholder="Выберите дату"
                  value={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date?.toString())}
                  valueFormat="DD.MM.YYYY"
                  maxDate={new Date()}
                  error={errors.birthday?.message}
                />
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="md"
          loading={mutation.isPending}
          className="modal-submit-btn"
        >
          Зарегистрировать
        </Button>
      </form>
    </Modal>
  );
};
