// const User = require("../models/User");
const xlsx = require("xlsx");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// Add Expense Source
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!category || !amount || !date || !icon) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    // Input sanitization
    const sanitizedAmount = Math.abs(parseFloat(amount));
    const sanitizedCategory = category.trim();

    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number!",
      });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category: sanitizedCategory,
      amount: sanitizedAmount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Expense Source
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expenses
exports.deleteExpense = async (req, res) => {
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // Also verify the expense belongs to the user
    const expense = await Expense.findOne({ _id: req.params.id, userId });
    
    if (!expense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }
    
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    const data = expense.map((item) => ({
      category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");

    // Write to buffer instead of disk
    const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
