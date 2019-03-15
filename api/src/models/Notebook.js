const mongoose = require('mongoose');
const ContentBlock = require('./ContentBlock');

// TODO: add validation that name is unique per user
const notebookSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
}, {
  timestamps: true,
});

// TODO: removing a notebook removes all associated content blocks

class NotebookClass {
  async contentBlocks() {
    const contentBlocks = await ContentBlock
      .find({ notebook: this })
      .sort({ position: 'asc' });

    return contentBlocks;
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

const Notebook = mongoose.model('Notebook', notebookSchema);

module.exports = Notebook;
