const mongoose = require('mongoose');
const tap = require('lodash/tap');
const ContentBlock = require('./ContentBlock');

const modelName = 'Notebook';

// TODO: add validation that name is unique per user
const notebookSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
}, {
  timestamps: true,
});

// TODO: removing a notebook removes all associated content blocks

class NotebookClass {
  contentBlocksQuery({ query, options } = {}) {
    return tap(ContentBlock.find({ notebook: this }), (q) => {
      if (query) q.merge(query);
      if (options) q.setOptions(options);
    });
  }

  toJSON() {
    const { id, name, createdAt, updatedAt } = this;

    return {
      id,
      name,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }

  async touch() {
    this.markModified('updatedAt');
    await this.save();
  }
}

notebookSchema.loadClass(NotebookClass);

const Notebook = mongoose.model(modelName, notebookSchema);

module.exports = Notebook;
