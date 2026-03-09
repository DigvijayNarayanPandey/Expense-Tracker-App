import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import InfoCard from "../../components/Cards/InfoCard";
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
          <InfoCard
            icon={<LuArrowDownLeft />}
            label="Total Income"
            value={addThousandSeparator(transactionData?.totalIncome || 0)}
            color="bg-green-500"
            details={`${incomeCount} transactions`}
          />

          <InfoCard
            icon={<LuArrowUpRight />}
            label="Total Expense"
            value={addThousandSeparator(transactionData?.totalExpense || 0)}
            color="bg-red-500"
            details={`${expenseCount} transactions`}
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Net Balance"
            value={addThousandSeparator(transactionData?.totalBalance || 0)}
            color="bg-orange-500"
            details={`${transactionData?.transactions?.length || 0} total`}
          />
        </div>

        {/* Filters & Search */}
        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h5 className="text-lg font-medium dark:text-white">All Transactions</h5>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-full sm:w-auto transition-colors">
                <LuSearch className="text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="bg-transparent text-sm text-black dark:text-white outline-none w-full sm:w-48 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1 transition-colors">
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
                        ? "bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm dark:shadow-none"
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
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
