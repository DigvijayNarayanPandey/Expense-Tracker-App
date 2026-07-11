const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

// Get All Transactions (Income + Expense)
exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const [incomeTransactions, expenseTransactions] = await Promise.all([
      Income.find({ userId }).sort({ date: -1 }),
      Expense.find({ userId }).sort({ date: -1 }),
    ]);

    const allTransactions = [
      ...incomeTransactions.map((txn) => ({ ...txn.toObject(), type: "income" })),
      ...expenseTransactions.map((txn) => ({ ...txn.toObject(), type: "expense" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalIncome = incomeTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalExpense = expenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);

    res.json({
      transactions: allTransactions,
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};

// Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Parallelize all 6 DB queries
    const [
      totalIncomeAgg,
      totalExpenseAgg,
      last30DaysIncomeTransactions,
      last30DaysExpenseTransactions,
      recentIncomeList,
      recentExpenseList,
    ] = await Promise.all([
      // Total income aggregate
      Income.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      // Total expense aggregate
      Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      // Last 30 days income transactions
      Income.find({
        userId,
        date: { $gte: thirtyDaysAgo },
      }).sort({ date: -1 }),
      // Last 30 days expense transactions
      Expense.find({
        userId,
        date: { $gte: thirtyDaysAgo },
      }).sort({ date: -1 }),
      // Last 5 income transactions
      Income.find({ userId }).sort({ date: -1 }).limit(5),
      // Last 5 expense transactions
      Expense.find({ userId }).sort({ date: -1 }).limit(5),
    ]);

    // Calculate 30-day totals
    const incomeLast30Days = last30DaysIncomeTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    // Merge and sort last 5 of each type
    const lastTransactions = [
      ...recentIncomeList.map((txn) => ({ ...txn.toObject(), type: "income" })),
      ...recentExpenseList.map((txn) => ({ ...txn.toObject(), type: "expense" })),
    ].sort((a, b) => b.date - a.date);

    // Final Response
    res.json({
      totalBalance:
        (totalIncomeAgg[0]?.total || 0) - (totalExpenseAgg[0]?.total || 0),
      totalIncome: totalIncomeAgg[0]?.total || 0,
      totalExpense: totalExpenseAgg[0]?.total || 0,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last30DaysIncome: {
        total: incomeLast30Days,
        transactions: last30DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};
