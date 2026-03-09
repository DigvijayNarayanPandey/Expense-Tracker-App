// const User = require("../models/User");
const xlsx = require("xlsx");
const Income = require("../models/Income");
const mongoose = require("mongoose");

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!source || !amount || !date || !icon) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    // Input sanitization
    const sanitizedAmount = Math.abs(parseFloat(amount));
    const sanitizedSource = source.trim();

    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number!",
      });
    }

    const newIncome = new Income({
      userId,
      icon,
      source: sanitizedSource,
      amount: sanitizedAmount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Income Source
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income
exports.deleteIncome = async (req, res) => {
  const userId = req.user.id;
 
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // Also verify the income belongs to the user
    const income = await Income.findOne({ _id: req.params.id, userId });
    
    if (!income) {
      return res.status(404).json({ message: "Income not found or unauthorized" });
    }
    
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    // Write to buffer instead of disk
    const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
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
