import { useSearchParams } from "react-router-dom";

export const useReportFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    start: searchParams.get("start"),
    end: searchParams.get("end"),
    icdRoots: searchParams.getAll("icdRoots"),
  };

  const setFilters = (newFilters: Partial<typeof filters>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      nextParams.delete(key);

      if (value != null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            value.forEach((v) => nextParams.append(key, String(v)));
          }
        } else {
          nextParams.set(key, String(value));
        }
      }
    });
    setSearchParams(nextParams);
  };
  return { filters, setFilters };
};
