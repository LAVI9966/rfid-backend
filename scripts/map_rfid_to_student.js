const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StudentMapping = require('../models/StudentMapping');

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lavishgehlod_db_user:fKRg7GFZ7LwNjE7H@cluster0.w5ky1bv.mongodb.net/rfid';

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
        { tagId: '846DD6 05', studentId: 'S101', studentName: 'Dipesh Gehlod' },
        { tagId: '13A32D31', studentId: 'S102', studentName: 'Abhinav Yadav' },
        { tagId: 'D751A9 04', studentId: 'S103', studentName: 'Krishna Soni' },
        { tagId: 'EDCBB7 03', studentId: 'S104', studentName: 'Ankit Yadav' },
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