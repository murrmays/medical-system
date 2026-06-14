import { useSearchParams } from "react-router-dom";

export const useInspectionsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    grouped: searchParams.get("grouped") === "true",
    icdRoots: searchParams.getAll("icdRoots"),
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || 4,
  };

  const setFilters = (newFilters: Partial<typeof filters>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      nextParams.delete(key);

      if (value != null && value !== false) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            value.forEach((v) => nextParams.append(key, String(v)));
          }
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
