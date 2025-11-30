// src/components/emall/detail/utils/dataHelpers.ts
export const getSafeArray = (array: any[] | null | undefined): any[] => {
  if (Array.isArray(array)) {
    return array;
  }
  if (typeof array === 'string') {
    try {
      const parsed = JSON.parse(array);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const hasArrayData = (array: any[] | null | undefined): boolean => {
  const safeArray = getSafeArray(array);
  return safeArray.length > 0;
};
