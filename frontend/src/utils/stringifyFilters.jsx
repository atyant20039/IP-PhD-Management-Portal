const stringifyFilters = (filters) => {
  return Object.entries(filters)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
};

export default stringifyFilters;
