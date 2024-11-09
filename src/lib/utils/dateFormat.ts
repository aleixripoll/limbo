const dateFormat = (datetime: string | Date) => {
  const dateTime = new Date(datetime);

  const date = dateTime.toLocaleDateString("ca", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return date;
};

export default dateFormat;
