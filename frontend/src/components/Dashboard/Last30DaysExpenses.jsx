import React, { useEffect, useState } from "react";
import { prepareExpenseBarChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

const Last30DaysExpenses = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setChartData(result);

    return () => {};
  }, [data]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>
      
      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] mt-6">
          <span className="text-sm text-gray-600 dark:text-slate-400">Total expense</span>
          <span className="text-[24px] text-gray-900 dark:text-slate-100 mt-1">₹0</span>
        </div>
      ) : (
        <CustomBarChart data={chartData} />
      )}
    </div>
  );
};

export default Last30DaysExpenses;
