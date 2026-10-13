const mongoose = require('mongoose');

const formulaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  titleGujarati: { type: String },
  grades: [{ type: String }],
  formulas: [{ type: String }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Formula', formulaSchema);
