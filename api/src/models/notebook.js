const mongoose = require('mongoose');

const notebookSchema = mongoose.Schema({ name: String }, { timestamps: true });

const Notebook = mongoose.model('Notebook', notebookSchema);
module.exports = Notebook;
