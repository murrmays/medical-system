import { Loader, Select } from "@mantine/core";
import { Controller } from "react-hook-form";

export const DiagnosisSelect = ({
  index,
  control,
  errors,
  icdData,
  isFetching,
  onSearch,
  diagnosisDetails,
}: any) => {
  return (
    <Controller
      name={`diagnoses.${index}.icdDiagnosisId`}
      control={control}
      render={({ field: selectField }) => {
        const options =
          icdData?.records.map((i: any) => ({
            value: i.id,
            label: `${i.code} ${i.name}`,
          })) || [];

        const currentId = selectField.value;

        if (currentId && !options.some((opt: any) => opt.value === currentId)) {
          const detail = diagnosisDetails
            .map((q: any) => q.data?.records?.[0])
            .find((r: any) => r?.id === currentId);

          if (detail) {
            options.push({
              value: detail.id,
              label: `${detail.code} ${detail.name}`,
            });
          }
        }

        return (
          <Select
            {...selectField}
            label="Болезнь"
            searchable
            data={options}
            onSearchChange={onSearch}
            filter={({ options }) => options}
            nothingFoundMessage="Ничего не найдено"
            rightSection={isFetching ? <Loader size="xs" /> : null}
            error={errors.diagnoses?.[index]?.icdDiagnosisId?.message}
            onChange={(val) => selectField.onChange(val)}
          />
        );
      }}
    />
  );
};
