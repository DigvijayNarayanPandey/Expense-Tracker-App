const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Get All Transactions (Income + Expense)
exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomeTransactions = (
      await Income.find({ userId }).sort({ date: -1 })
    ).map((txn) => ({
      ...txn.toObject(),
      type: "income",
    }));

    const expenseTransactions = (
      await Expense.find({ userId }).sort({ date: -1 })
    ).map((txn) => ({
      ...txn.toObject(),
      type: "expense",
    }));

    const allTransactions = [
      ...incomeTransactions,
      ...expenseTransactions,
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalIncome = incomeTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );
    const totalExpense = expenseTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    res.json({
      transactions: allTransactions,
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
};

//Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    //Fetch total income & expense
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("totalIncome", {
      totalIncome,
      userId: isValidObjectId(userId),
    });

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get Income Transactions in the last 30 days
    const last30DaysTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total Income for last 30 days
    const incomeLast30Days = last30DaysTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get expense transactions in the last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total expenses for last 30 days
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Fetch last 5 transactions (income + expenses)
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "income",
        })
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "expense",
        })
      ),
    ].sort((a, b) => b.date - a.date); // Sort latest first

    // Final Response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysEpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast30Days,
        transactions: last30DaysTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
};
