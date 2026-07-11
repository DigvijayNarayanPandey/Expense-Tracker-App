const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    icon: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient per-user date-sorted queries
ExpenseSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Expense", ExpenseSchema);
