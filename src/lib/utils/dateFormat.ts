const dateFormat = (datetime: string | Date) => {
  const dateTime = new Date(datetime);

  const day = dateTime.getDate();
  const month = dateTime.getMonth() + 1; // numeric month (1-12)
  const year = dateTime.getFullYear();

  return `${day}-${month}-${year}`;
};

export default dateFormat;
