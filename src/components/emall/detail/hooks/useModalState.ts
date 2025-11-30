// src/components/emall/detail/hooks/useModalState.ts
export const useModalState = (isOpen: boolean) => {
  if (!isOpen) {
    return { shouldRender: false };
  }
  return { shouldRender: true };
};
