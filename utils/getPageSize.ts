// utils\getPageSize.ts
export const getPageSize = () => {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 3;
  return 3;
};
