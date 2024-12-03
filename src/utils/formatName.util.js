const formatCityName = (cityName) => {
  return cityName
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default formatCityName;
