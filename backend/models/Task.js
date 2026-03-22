const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    category: {
      type: String,
      enum: ["Tax Filing", "Audit", "Payroll", "Legal", "Regulatory", "Other"],
      default: "Other",
    },
    due_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);