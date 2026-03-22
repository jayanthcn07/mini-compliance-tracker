const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    entity_type: {
      type: String,
      enum: ["LLC", "Corporation", "Partnership", "Sole Proprietorship", "Other"],
      default: "LLC",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);