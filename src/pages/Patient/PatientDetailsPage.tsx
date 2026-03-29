import { useQuery } from "@tanstack/react-query";
import { getPatient, getPatientsInspections } from "../../api/patient";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, MultiSelect, Radio, Select, Group } from "@mantine/core";
import { Mars, Venus } from "lucide-react";
import { useInspectionsFilter } from "../../hooks/inspectionsFilter";
import { getIcdRoots } from "../../api/dictionary";
import "./PatientDetails.css";
import { InspectionCard } from "../../components/InspectionCard";
import { PaginationFooter } from "../../components/PaginationFooter";
import { useMemo } from "react";
import { ChainedInspectionCard } from "../../components/ChainedInspectionCard";

export const PatientDetailsPage = () => {
  const { filters, setFilters } = useInspectionsFilter();
  const navigate = useNavigate();
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

  const { id } = useParams<{ id: string }>();
  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatient(id as string),
  });
  const { data: inspections, isLoading: isInspecLoading } = useQuery({
    queryKey: ["inspections", filters],
    queryFn: () => getPatientsInspections(patient.id, filters),
  });

  const isDead = inspections?.inspections.some((i) => i.conclusion === "Death");

  const { inspectionsMap, nextIdMap, rootInspections } = useMemo(() => {
    const allInspections = inspections?.inspections || [];
    const iMap = new Map();
    const nMap = new Map();

    allInspections.forEach((i) => iMap.set(i.id, i));
    allInspections.forEach((i) => {
      if (i.previousId) nMap.set(i.previousId, i.id);
    });

    const roots = filters.grouped
      ? allInspections.filter((i) => !i.previousId || iMap.has(i.previousId))
      : allInspections;

    console.log(roots.map((r) => r.hasNested));
    return { inspectionsMap: iMap, nextIdMap: nMap, rootInspections: roots };
  }, [inspections, filters.grouped]);

  if (isLoading)
    return (
      <div className="page-placeholder">
        <Loader size="md" />
      </div>
    );
  if (!patient)
    return <div className="page-placeholder">Пациент не найден</div>;

  return (
    <div className="patient-page-root">
      <div className="patient-page-wrapper">
        <section className="patient-medical-card">
          <div className="card-header-row">
            <h1 className="page-title">Медицинская карта пациента</h1>
            {!isDead && (
              <button
                className="create-inspection-btn"
                onClick={() =>
                  navigate("/inspection/create", { state: { patientId: id } })
                }
              >
                Добавить осмотр
              </button>
            )}
          </div>
          <div className="card-info-row">
            <div className="patient-name-group">
              <span className="patient-card-name">
                {patient.name}{" "}
                {patient.gender === "Male" ? (
                  <Mars className="gender-icon" size={20} />
                ) : (
                  <Venus className="gender-icon" size={20} />
                )}
              </span>
            </div>
            <div className="patient-birthdate">
              Дата рождения:{" "}
              {new Date(patient.birthday).toLocaleDateString("ru-RU")}
            </div>
          </div>
        </section>
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
          {isInspecLoading ? (
            <Loader size={"sm"} />
          ) : filters.grouped ? (
            rootInspections?.map((inspection) => (
              <ChainedInspectionCard
                key={inspection.id}
                inspectionId={inspection.id}
                inspectionsMap={inspectionsMap}
                nextIdMap={nextIdMap}
                isDead={isDead}
              />
            ))
          ) : (
            inspections?.inspections.map((i) => (
              <InspectionCard key={i.id} inspection={i} isDead={isDead} />
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
