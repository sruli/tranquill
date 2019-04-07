const mongoose = require('mongoose');

const modelName = 'ContentBlock';
const fetchLimitDefault = 10;
const keyUniqErrorMessage = 'Key has already been taken.';

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
  minimize: false,
});

contentBlockSchema.path('key').validate({
  validator: async function validateKeyUniquness(key) {
    if (this.isNew || this.isModified('key')) {
      const existing = await this.model(modelName).findOne({ key, notebook: this.notebook });
      return !existing;
    }

    return true;
  },
  message: keyUniqErrorMessage,
});

class ContentBlockClass {
  toJSON() {
    const {
      notebook,
      key,
      text,
      type,
      depth,
      inlineStyleRanges,
      entityRanges,
      data,
      position,
      createdAt,
      updatedAt,
    } = this;

    return {
      notebook,
      key,
      text,
      type,
      depth,
      inlineStyleRanges,
      entityRanges,
      data,
      position,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}

contentBlockSchema.loadClass(ContentBlockClass);

const ContentBlock = mongoose.model(modelName, contentBlockSchema);

module.exports = ContentBlock;
module.exports.FETCH_LIMIT_DEFAULT = fetchLimitDefault;
module.exports.KEY_UNIQ_ERROR_MSG = keyUniqErrorMessage;
