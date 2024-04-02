export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
