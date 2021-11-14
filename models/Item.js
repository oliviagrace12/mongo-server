const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
    {
        "title": { type: String, required: true },
        "description": { type: String },
        "createdTime": { type: Date, required: true },
        "complete": { type: Boolean, default: false },
        "completedTime": { type: Date },
        "user": { type: Schema.Types.ObjectId, ref: 'User', required: true }
    }
)

module.exports = mongoose.model('Item', ItemSchema)
