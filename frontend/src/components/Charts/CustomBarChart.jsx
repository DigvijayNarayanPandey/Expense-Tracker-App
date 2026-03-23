import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {
  // Function to alternate colours
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#0d9488" : "#99f6e4";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-2 border border-gray-300 dark:border-slate-700">
          <p className="text-xs font-semibold text-teal-800 dark:text-teal-400 mb-1">
            {payload[0].payload.category || payload[0].payload.source}
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Amount:{" "}
            <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
              ₹{Number(payload[0].payload.amount).toLocaleString("en-IN")}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12 }} stroke="none" />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar
            dataKey="amount"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: "yellow" }}
            activeStyle={{ fill: "green" }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
