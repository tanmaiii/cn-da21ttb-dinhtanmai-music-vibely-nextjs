"use client";

import { useState } from "react";
import styles from "./style.module.scss";
import { Checkbox } from "@/components/ui";

interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface TableProps<T> {
  columns: Column[];
  renderRow: (item: T) => React.ReactNode;
  data: T[];
  className?: string;
}

const Table = <T extends object>({
  columns,
  renderRow,
  data,
  className,
}: TableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) => {
      const newSelectedRows = new Set(prev);
      if (newSelectedRows.has(id)) {
        newSelectedRows.delete(id);
      } else {
        newSelectedRows.add(id);
      }
      return newSelectedRows;
    });
  };

  return (
    <table className={`${styles.Table} ${className}`}>
      <thead className={styles.Table_header}>
        <tr className="text-left text-gray-500 text-sm">
          <th colSpan={1} className="px-4 py-2">
            <Checkbox
              name="select_all"
              value="select_all"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRows(new Set(data.map((_, index) => index)));
                } else {
                  setSelectedRows(new Set());
                }
              }}
              checked={selectedRows.size === data.length}
            />
          </th>

          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.Table_body}>
        {data.map((item, index) => (
          <tr key={index} className="border-b">
            {/* Checkbox cho mỗi hàng */}
            <td colSpan={1} className="px-4 py-2">
              <Checkbox
                name={`select_item-${index}`}
                value={`select_item-${index}`}
                checked={selectedRows.has(index)}
                onChange={() => handleSelectRow(index)}
              />
            </td>
            {renderRow(item)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
