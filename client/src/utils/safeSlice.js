export const safeSlice = (arr, start, end) => {
  if (Array.isArray(arr)) {
    return arr.slice(start, end);
  }
  return [];
};
