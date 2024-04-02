
const convertFiltersToString = (filters) => {
    return Object.entries(filters)
      .filter(([key, value]) => value !== "") // Remove empty values
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  };
  
  export default convertFiltersToString;
  