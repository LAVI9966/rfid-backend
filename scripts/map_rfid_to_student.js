const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StudentMapping = require('../models/StudentMapping');

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rfid-attendance';

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Function to map RFID cards to students
async function mapRfidToStudent() {
    const mappings = [
        { tagId: 'RFID001', studentId: 'S101', studentName: 'Amit Sharma' },
        { tagId: 'RFID002', studentId: 'S102', studentName: 'Priya Singh' },
        { tagId: 'RFID003', studentId: 'S103', studentName: 'Rahul Verma' },
        { tagId: 'RFID003', studentId: 'S104', studentName: 'Rahul Verma' },
    ];

    try {
        for (const mapping of mappings) {
            const record = new StudentMapping(mapping);
            await record.save();
            console.log(`Saved mapping for RFID: ${mapping.tagId}`);
        }
        console.log('All mappings saved successfully');
    } catch (error) {
        console.error('Error saving mappings:', error);
    } finally {
        mongoose.connection.close();
    }
}

mapRfidToStudent();