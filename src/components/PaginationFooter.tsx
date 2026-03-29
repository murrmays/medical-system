import { Pagination } from "@mantine/core";
import "./PaginationFooter.css";

interface PaginationFooterProps {
  total: number;
  activePage: number;
  onPageChange: (page: number) => void;
}

export const PaginationFooter = ({
  total,
  activePage,
  onPageChange,
}: PaginationFooterProps) => {
  return (
    <footer className="pagination-footer">
      <Pagination
        total={total}
        value={activePage}
        onChange={onPageChange}
        color="var(--med-blue)"
        radius="xs"
      />
    </footer>
  );
};
