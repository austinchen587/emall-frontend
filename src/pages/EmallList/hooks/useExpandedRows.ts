// src/pages/EmallList/hooks/useExpandedRows.ts
import { useState } from 'react';

export const useExpandedRows = () => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return {
    expandedRows,
    toggleRowExpansion
  };
};
