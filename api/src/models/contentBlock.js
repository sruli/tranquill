const mongoose = require('mongoose');

// TODO: ensure that `key` is unique per user
// TODO: create compound index for notebook id and key
const contentBlockSchema = mongoose.Schema({
  notebook: { type: mongoose.Schema.Types.ObjectId, ref: 'Notebook', required: true },
  key: String,
  text: String,
  type: String,
  depth: Number,
  inlineStyleRanges: [],
  entityRanges: [],
  data: {},
  position: Number,
}, {
  timestamps: true,
});

const ContentBlock = mongoose.model('ContentBlock', contentBlockSchema);

module.exports = ContentBlock;
