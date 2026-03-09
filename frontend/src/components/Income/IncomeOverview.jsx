import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../utils/helper";

const IncomeOverview = ({ transaction, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareIncomeBarChartData(transaction);
    setChartData(result);

    return () => {};
  }, [transaction]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your earning over time and analyze your income trends.
          </p>
        </div>

        <button className="add-btn" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Add income
        </button>
      </div>

      <div className="mt-10">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] mt-6">
            <span className="text-sm text-gray-600 dark:text-slate-400">Total income</span>
            <span className="text-[24px] text-gray-900 dark:text-slate-100 font-semibold mt-1">₹0</span>
          </div>
        ) : (
          <CustomBarChart data={chartData} />
        )}
      </div>
    </div>
  );
};

export default IncomeOverview;
