export const getOrdinalSuffix = (i) => {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
};

export const formatDateDoMMM = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = getOrdinalSuffix(date.getDate());
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}`;
};

export const formatDateDoMMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = getOrdinalSuffix(date.getDate());
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  return Number(num).toLocaleString("en-IN");
};

export const prepareExpenseBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const chartData = sortedData.map((item) => ({
    month: formatDateDoMMM(item?.date),
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const chartData = sortedData.map((item) => ({
    month: formatDateDoMMM(item?.date),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const chartData = sortedData.map((item) => ({
    month: formatDateDoMMM(item?.date),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};
