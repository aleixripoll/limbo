const dateFormat = (datetime: string | Date) => {
  const dateTime = new Date(datetime);

  const day = dateTime.getDate();
  const month = dateTime.toLocaleDateString("ca-ES", { month: "long" });
  const year = dateTime.getFullYear();

  return `${day} ${month} ${year}`;
};

export default dateFormat;
