const mongoose = require('mongoose');

const studentMappingSchema = new mongoose.Schema({
    tagId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
});

module.exports = mongoose.model('StudentMapping', studentMappingSchema);