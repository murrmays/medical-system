import "./Patients.css";
import { usePatientsFilter } from "../../hooks/patientsFilter";
import { Conclusion, Sorting } from "../../types/enums";
import {
  Checkbox,
  Loader,
  MultiSelect,
  Select,
  TextInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getAllPatients } from "../../api/patient";
import { PaginationFooter } from "../../components/general/PaginationFooter";
import { PatientCard } from "../../components/patient/PatientCard";
import { useDisclosure } from "@mantine/hooks";
import { RegisterUserModal } from "../../components/patient/RegisterUserModal";

export const PatientsPage = () => {
  const { filters, setFilters } = usePatientsFilter();
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isLoading } = useQuery({
    queryKey: ["patients", filters],
    queryFn: () => getAllPatients(filters),
  });

  const sortData = [
    { value: Sorting.NameAsc, label: "По имени (А-Я)" },
    { value: Sorting.NameDesc, label: "По имени (Я-А)" },
    { value: Sorting.CreateAsc, label: "Сначала старые (дата создания)" },
    { value: Sorting.CreateDesc, label: "Сначала новые (дата создания)" },
    { value: Sorting.InspectionAsc, label: "Сначала новые осмотры" },
    { value: Sorting.InspectionDesc, label: "Сначала старые осмотры" },
  ];

  const conclusionData = [
    { value: Conclusion.Disease, label: "Болезнь" },
    { value: Conclusion.Recovery, label: "Выздоровление" },
    { value: Conclusion.Death, label: "Смерть" },
  ];

  const PAGE_SIZES = [4, 10, 12, 16, 20];
  const pageSizeData = PAGE_SIZES.map((size) => ({
    value: String(size),
    label: `${size}`,
  }));

  return (
    <div className="patients-page-root">
      <div className="patients-wrapper">
        <div className="title-group">
          <h1 className="page-title">Список пациентов</h1>
          <button className="register-user-btn" onClick={open}>
            Регистрация нового пациента
          </button>
        </div>
        <div className="patients-container">
          <section className="filter-card">
            <h2 className="filter-card-title">Фильтры и сортировка</h2>
            <div className="filters-grid">
              <div className="grid-row-top">
                <TextInput
                  label="Имя пациента"
                  placeholder="Поиск..."
                  value={filters.name}
                  className="medical-select"
                  onChange={(e) => setFilters({ name: e.currentTarget.value })}
                />

                <Select
                  label="Отсортировать по..."
                  data={sortData}
                  value={filters.sorting}
                  onChange={(val) => setFilters({ sorting: val as Sorting })}
                />
              </div>
              <div className="grid-row-bottom">
                <MultiSelect
                  label="Заключения"
                  placeholder="Выберите варианты"
                  data={conclusionData}
                  value={filters.conclusions}
                  onChange={(val) =>
                    setFilters({ conclusions: val as Conclusion[] })
                  }
                />

                <div className="checkbox-section">
                  <Checkbox
                    label="Мои пациенты"
                    checked={filters.onlyMine}
                    onChange={(e) =>
                      setFilters({ onlyMine: e.currentTarget.checked })
                    }
                  />

                  <Checkbox
                    label="Запланированы визиты"
                    checked={filters.scheduledVisits}
                    onChange={(e) =>
                      setFilters({ scheduledVisits: e.currentTarget.checked })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Select
                label="Пациентов на странице"
                data={pageSizeData}
                value={String(filters.size)}
                onChange={(val) => setFilters({ size: Number(val), page: 1 })}
              />
              <button
                className="reset-btn"
                onClick={() =>
                  setFilters({
                    name: "",
                    conclusions: [],
                    sorting: undefined,
                    onlyMine: false,
                    scheduledVisits: false,
                    size: undefined,
                  })
                }
              >
                Сбросить
              </button>
            </div>
          </section>
          <section className="patients-list">
            {isLoading ? (
              <Loader size={"sm"} />
            ) : (
              data?.patients.map((p) => <PatientCard key={p.id} patient={p} />)
            )}
          </section>
        </div>
      </div>
      <PaginationFooter
        total={data?.pagination.count || 1}
        activePage={filters.page}
        onPageChange={(page) => setFilters({ page })}
      />
      <RegisterUserModal opened={opened} onClose={close} />
    </div>
  );
};
