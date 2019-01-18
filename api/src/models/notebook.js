const mongoose = require('mongoose');

// TODO: add validation that name is unique per user
const notebookSchema = mongoose.Schema({
  name: { type: String, required: true },
}, {
  timestamps: true,
});

// TODO: removing a notebook removes all associated content blocks

const Notebook = mongoose.model('Notebook', notebookSchema);

module.exports = Notebook;
