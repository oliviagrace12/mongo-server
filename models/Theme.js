const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThemeSchema = new Schema(
    {
        primaryColor: { type: String, required: true },
        secondaryColor: { type: String, required: true }
    }
);

module.exports = mongoose.model('Theme', ThemeSchema);