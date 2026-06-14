import { useQuery } from "@tanstack/react-query";
import { Loader, MultiSelect, Radio, Select, Group } from "@mantine/core";
import { useInspectionsFilter } from "../../hooks/inspectionsFilter";
import { getIcdRoots } from "../../api/dictionary";
import "../Patient/Patients.css";
import { InspectionCard } from "../../components/inspection/InspectionCard";
import { PaginationFooter } from "../../components/general/PaginationFooter";
import { InspectionChain } from "../../components/inspection/InspectionChain";
import { getConsultationInspections } from "../../api/consultation";

export const ConsultationList = () => {
  const { filters, setFilters } = useInspectionsFilter();
  const { data: icdRootsDictionary, isLoading: isRootsLoading } = useQuery({
    queryKey: ["icdRoots"],
    queryFn: getIcdRoots,
  });
  const selectOptions = icdRootsDictionary?.map((item) => ({
    value: item.id,
    label: `${item.code} ${item.name}`,
  }));
  const PAGE_SIZES = [4, 10, 12, 16, 20];
  const pageSizeData = PAGE_SIZES.map((size) => ({
    value: String(size),
    label: `${size}`,
  }));

  const { data: inspections, isLoading: isLoading } = useQuery({
    queryKey: ["inspections", filters],
    queryFn: () => getConsultationInspections(filters),
  });

  const isGrouped = filters.grouped;

  if (isLoading)
    return (
      <div className="page-placeholder">
        <Loader size="md" />
      </div>
    );

  return (
    <div className="patient-page-root">
      <div className="patient-page-wrapper">
        <section className="inspections-filter-card">
          <h2 className="filter-card-title">Фильтры и сортировка</h2>
          <div className="filters-grid">
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
            <div className="radio-section">
              <Radio.Group
                value={String(filters.grouped)}
                onChange={(val) => setFilters({ grouped: val === "true" })}
              >
                <Group mt="sm">
                  <Radio
                    value="true"
                    label="Сгруппировать по повторным"
                    color="var(--med-accent)"
                  />
                  <Radio
                    value="false"
                    label="Показать все"
                    color="var(--med-accent)"
                  />
                </Group>
              </Radio.Group>
            </div>
          </div>
          <div className="card-footer">
            <Select
              label="Осмотров на странице"
              data={pageSizeData}
              value={String(filters.size)}
              onChange={(val) => setFilters({ size: Number(val), page: 1 })}
            />
            <button
              className="reset-btn"
              onClick={() =>
                setFilters({
                  grouped: undefined,
                  size: undefined,
                  icdRoots: undefined,
                })
              }
            >
              Сбросить
            </button>
          </div>
        </section>
        <section className="inspections-list">
          {isLoading ? (
            <Loader size={"sm"} />
          ) : filters.grouped ? (
            inspections?.inspections.map((rootInspection) => (
              <InspectionChain
                key={rootInspection.id}
                rootInspection={rootInspection}
                isDead={true}
                isGrouped={isGrouped}
              />
            ))
          ) : (
            inspections?.inspections.map((i) => (
              <InspectionCard
                key={i.id}
                inspection={i}
                isGrouped={isGrouped}
                isDead={true}
              />
            ))
          )}
        </section>
      </div>
      <PaginationFooter
        total={inspections?.pagination.count || 1}
        activePage={filters.page}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
};
