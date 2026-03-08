import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import TransactionInfoCard from "../../components/Cards/TransactionInfoCard";
import moment from "moment";
import { addThousandSeparator } from "../../utils/helper";
import {
  LuArrowDownLeft,
  LuArrowUpRight,
  LuWalletMinimal,
  LuSearch,
} from "react-icons/lu";

const Transactions = () => {
  useUserAuth();

  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "income" | "expense"
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllTransactions = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_ALL_TRANSACTIONS,
      );

      if (response.data) {
        setTransactionData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
    return () => {};
  }, []);

  const filteredTransactions = transactionData?.transactions?.filter((txn) => {
    const matchesFilter = filter === "all" || txn.type === filter;
    const label = txn.type === "income" ? txn.source : txn.category;
    const matchesSearch = label
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const incomeCount =
    transactionData?.transactions?.filter((t) => t.type === "income").length ||
    0;
  const expenseCount =
    transactionData?.transactions?.filter((t) => t.type === "expense").length ||
    0;

  return (
    <DashboardLayout activeMenu="Transactions">
      <div className="my-5 mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center text-xl text-white bg-green-500 rounded-full">
              <LuArrowDownLeft />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Income</p>
              <h5 className="text-lg font-semibold text-gray-700">
                ₹{addThousandSeparator(transactionData?.totalIncome || 0)}
              </h5>
              <p className="text-xs text-gray-700">
                {incomeCount} transactions
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center text-xl text-white bg-red-500 rounded-full">
              <LuArrowUpRight />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Expense</p>
              <h5 className="text-lg font-semibold text-gray-700">
                ₹{addThousandSeparator(transactionData?.totalExpense || 0)}
              </h5>
              <p className="text-xs text-gray-600">
                {expenseCount} transactions
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center text-xl text-white bg-orange-500 rounded-full">
              <LuWalletMinimal />
            </div>
            <div>
              <p className="text-xs text-gray-600">Net Balance</p>
              <h5 className="text-lg font-semibold text-gray-700">
                ₹{addThousandSeparator(transactionData?.totalBalance || 0)}
              </h5>
              <p className="text-xs text-gray-700">
                {transactionData?.transactions?.length || 0} total
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h5 className="text-lg font-medium">All Transactions</h5>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-auto">
                <LuSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="bg-transparent text-sm outline-none w-full sm:w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {[
                  { key: "all", label: "All" },
                  { key: "income", label: "Income" },
                  { key: "expense", label: "Expense" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      filter === tab.key
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              Loading transactions...
            </div>
          ) : filteredTransactions?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              {filteredTransactions.map((txn) => (
                <TransactionInfoCard
                  key={txn._id}
                  title={txn.type === "income" ? txn.source : txn.category}
                  icon={txn.icon}
                  date={moment(txn.date).format("Do MMM YYYY")}
                  amount={txn.amount}
                  type={txn.type}
                  hideDeleteBtn
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              {searchQuery || filter !== "all"
                ? "No transactions match your filters."
                : "No transactions found."}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
