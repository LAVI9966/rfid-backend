const mongoose = require('mongoose');

const rfidSchema = new mongoose.Schema({
    tagId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    status: { type: String, required: true },
    inTime: { type: String },
    outTime: { type: String },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rfid', rfidSchema);