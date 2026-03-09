import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-2 border border-gray-300 dark:border-slate-700">
        <p className="text-xs font-semibold text-purple-800 dark:text-purple-400 mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Amount:{" "}
          <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
            ₹{Number(payload[0].value).toLocaleString("en-IN")}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
