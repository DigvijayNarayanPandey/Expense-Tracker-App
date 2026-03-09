import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Expense Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your spending trends over time and gain insights into where
            your money goes.
          </p>
        </div>
        <button className="add-btn" onClick={onExpenseIncome}>
          <LuPlus className="text-lg" />
          Add Expense
        </button>
      </div>
      <div className="mt-10">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] mt-6">
            <span className="text-sm text-gray-600 dark:text-slate-400">Total expense</span>
            <span className="text-[24px] text-gray-900 dark:text-slate-100 font-semibold mt-1">₹0</span>
          </div>
        ) : (
          <CustomLineChart data={chartData} />
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview;
