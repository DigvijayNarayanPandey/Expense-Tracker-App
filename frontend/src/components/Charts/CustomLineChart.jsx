import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const CustomLineChart = ({ data }) => {
  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-2 border border-gray-300 dark:border-slate-700">
          <p className="text-xs font-semibold text-teal-800 dark:text-teal-400 mb-1">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Amount:{" "}
            <sapn className="text-sm font-medium text-gray-900 dark:text-slate-100">
              ₹{Number(payload[0].payload.amount).toLocaleString("en-IN")}
            </sapn>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="none" />
          <YAxis tick={{ fontSize: 12 }} stroke="none" />
          <Tooltip content={<CustomToolTip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#0d9488"
            strokeWidth={3}
            dot={{ r: 3, fill: "#5eead4" }}
            fill="url(#incomeGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
