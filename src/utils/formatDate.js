const convertDate = (dateStr) => {
  if (!dateStr) return null;

  // DD/MM/YYYY
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }

  // DD-MM-YYYY
  if (dateStr.includes("-")) {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  }

  return null;
};

module.exports = convertDate;