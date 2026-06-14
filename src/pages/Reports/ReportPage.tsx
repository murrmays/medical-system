import {
  Box,
  Loader,
  MultiSelect,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { getIcdRoots } from "../../api/dictionary";
import { useQuery } from "@tanstack/react-query";
import { DateInput } from "@mantine/dates";
import { generateReport } from "../../api/reports";
import { useReportFilter } from "../../hooks/reportFilters";
import "./ReportPage.css";

export const ReportPage = () => {
  const { filters, setFilters } = useReportFilter();
  const { data: icdRootsDictionary, isLoading: isRootsLoading } = useQuery({
    queryKey: ["icdRoots"],
    queryFn: getIcdRoots,
  });
  const selectOptions = icdRootsDictionary?.map((item) => ({
    value: item.id,
    label: `${item.code} ${item.name}`,
  }));

  const isFilterValid = filters.start && filters.end;

  const { data: reportData, isFetching: isReportLoading } = useQuery({
    queryKey: ["icdReport", filters],
    queryFn: () =>
      generateReport({
        start: new Date(filters.start!).toISOString(),
        end: new Date(filters.end!).toISOString(),
        icdRoots: filters.icdRoots!,
      }),
    enabled: !!isFilterValid,
  });
  const icdColumns = reportData
    ? Object.keys(reportData.summaryByRoot).sort((a, b) => a.localeCompare(b))
    : [];

  return (
    <div className="report-page-root">
      <div className="report-page-wrapper">
        <Stack gap="xl" p="md">
          <h1 className="page-title">Отчет по заболеваемости</h1>

          <section className="inspections-filter-card">
            <h2 className="filter-card-title">Фильтры</h2>
            <MultiSelect
              label="МКБ-10"
              placeholder={isRootsLoading ? "Загрузка..." : "Выберите диагноз"}
              data={selectOptions}
              value={filters.icdRoots}
              onChange={(val) => {
                setFilters({ icdRoots: val });
              }}
              searchable
              clearable
              className="select-row"
            />
            <div className="report-filters-grid">
              <div className="filter-item">
                <DateInput
                  value={filters.start ? new Date(filters.start) : null}
                  onChange={(val) => {
                    setFilters({ start: val?.toString() });
                  }}
                  label="Дата с"
                  valueFormat="DD.MM.YYYY HH:mm"
                  maxDate={new Date()}
                />
              </div>
              <div className="filter-item">
                <DateInput
                  value={filters.end ? new Date(filters.end) : null}
                  onChange={(val) => {
                    setFilters({ end: val?.toString() });
                  }}
                  label="Дата по"
                  valueFormat="DD.MM.YYYY HH:mm"
                  maxDate={new Date()}
                />
              </div>
            </div>
            <div className="card-footer" style={{ justifyContent: "right" }}>
              <button
                className="reset-btn"
                onClick={() =>
                  setFilters({
                    start: undefined,
                    end: undefined,
                    icdRoots: [],
                  })
                }
              >
                Сбросить
              </button>
            </div>
          </section>

          {isReportLoading && <Loader />}
          {reportData && !isReportLoading && (
            <Paper
              withBorder
              p="0"
              radius="md"
              shadow="sm"
              style={{ overflow: "hidden" }}
            >
              <Box
                p="md"
                bg="gray.0"
                style={{ borderBottom: "1px solid #e9ecef" }}
              >
                <Text span c="dark" fw={500}>
                  Отчет за период:{" "}
                  <b>
                    {new Date(reportData.filters.start).toLocaleDateString()} —{" "}
                    {new Date(reportData.filters.end).toLocaleDateString()}
                  </b>
                </Text>
              </Box>

              <ScrollArea>
                <Table
                  striped
                  highlightOnHover
                  withTableBorder={false}
                  withColumnBorders
                  verticalSpacing="sm"
                >
                  <Table.Thead>
                    <Table.Tr bg="gray.1">
                      <Table.Th w={250}>Пациент</Table.Th>
                      <Table.Th w={120}>Дата рождения</Table.Th>
                      <Table.Th w={100}>Пол</Table.Th>
                      {icdColumns.map((icdCode) => (
                        <Table.Th key={icdCode} ta="center">
                          {icdCode}
                        </Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {reportData.records.map((record, index) => (
                      <Table.Tr key={index}>
                        <Table.Td fw={500} ta="left">
                          {record.patientName}
                        </Table.Td>
                        <Table.Td>
                          {new Date(
                            record.patientBirthdate,
                          ).toLocaleDateString()}
                        </Table.Td>
                        <Table.Td>
                          {record.gender === "Male" ? "Муж" : "Жен"}
                        </Table.Td>

                        {icdColumns.map((icdCode) => {
                          const count = record.visitsByRoot[icdCode] || 0;
                          return (
                            <Table.Td
                              key={icdCode}
                              ta="center"
                              c={count === 0 ? "gray.4" : "dark"}
                              fw={count > 0 ? 600 : 400}
                            >
                              {count}
                            </Table.Td>
                          );
                        })}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>

                  <Table.Tfoot>
                    <Table.Tr bg="blue.0">
                      <Table.Th colSpan={3} ta="left" fz="md">
                        ИТОГО ВИЗИТОВ:
                      </Table.Th>
                      {icdColumns.map((icdCode) => (
                        <Table.Th key={icdCode} ta="center" fz="md" c="blue.9">
                          {reportData.summaryByRoot[icdCode] || 0}
                        </Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Tfoot>
                </Table>
              </ScrollArea>
            </Paper>
          )}
        </Stack>
      </div>
    </div>
  );
};
