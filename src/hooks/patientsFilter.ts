import { useSearchParams } from "react-router-dom";
import { Conclusion, Sorting } from "../types/enums";

export const usePatientsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawConclusions = searchParams.getAll("conclusions");
  const validatedConclusions = rawConclusions.filter((c): c is Conclusion =>
    Object.values(Conclusion).includes(c as Conclusion),
  );
  const filters = {
    name: searchParams.get("name") || "",
    conclusions: validatedConclusions,
    sorting: (searchParams.get("sorting") as Sorting) || Sorting.NameAsc,
    onlyMine: searchParams.get("onlyMine") === "true",
    scheduledVisits: searchParams.get("scheduledVisits") === "true",
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || 4,
  };

  const setFilters = (newFilters: Partial<typeof filters>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      nextParams.delete(key);

      if (
        value !== undefined &&
        value !== "" &&
        value !== false &&
        (Array.isArray(value) ? value.length > 0 : true)
      ) {
        if (Array.isArray(value)) {
          value.forEach((v) => nextParams.append(key, v));
        } else {
          nextParams.set(key, String(value));
        }
      }
    });
    if (!newFilters.hasOwnProperty("page")) {
      nextParams.set("page", "1");
    }

    setSearchParams(nextParams);
  };

  return { filters, setFilters };
};
