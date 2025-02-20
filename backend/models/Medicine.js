const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prescriptionDate: { type: String },
  registerDate: { type: String },
  pharmacy: { type: String },
  dosageGuide: { type: String },
  warning: { type: String },
  sideEffects: { type: String },
  active: { type: Boolean, default: true }, // 복용 여부
});

module.exports = mongoose.model("Medicine", MedicineSchema);
