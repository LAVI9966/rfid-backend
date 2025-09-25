const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const StudentMapping = require('./models/StudentMapping');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lavishgehlod_db_user:fKRg7GFZ7LwNjE7H@cluster0.w5ky1bv.mongodb.net/rfid'
// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all requests
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define RFID schema and model
const rfidSchema = new mongoose.Schema({
    tagId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    status: { type: String, required: true },
    inTime: { type: String },
    outTime: { type: String },
    timestamp: { type: Date, default: Date.now },
});

const Rfid = mongoose.model('Rfid', rfidSchema);

// Refined POST endpoint to handle inTime and outTime logic
app.post('/rfid', async (req, res) => {
    const { tagId } = req.body;

    try {
        // Find the student mapping for the given tagId
        const studentMapping = await StudentMapping.findOne({ tagId });

        if (!studentMapping) {
            return res.status(404).json({ message: 'Student mapping not found for the given tagId' });
        }

        const { studentId, studentName } = studentMapping;

        // Check if there is an existing record for the student with no outTime
        const existingRecord = await Rfid.findOne({ studentId, outTime: null });

        if (existingRecord) {
            // Update the outTime for the existing record
            existingRecord.outTime = new Date().toISOString();
            await existingRecord.save();
            return res.status(200).json({ message: 'Out time updated successfully', record: existingRecord });
        }

        // Create a new record for the student
        const newRecord = new Rfid({
            tagId,
            studentId,
            studentName,
            status: 'Present',
            inTime: new Date().toISOString(),
        });

        await newRecord.save();
        res.status(201).json({ message: 'In time recorded successfully', record: newRecord });
    } catch (error) {
        console.error('Error handling RFID data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET endpoint to list all RFID entries
app.get('/rfid', async (req, res) => {
    try {
        const rfidEntries = await Rfid.find();
        res.status(200).json({
            success: true,
            data: rfidEntries,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching RFID entries',
            error: error.message,
        });
    }
});

// POST endpoint to mark attendance
app.post('/attendance', async (req, res) => {
    try {
        const { tagId } = req.body;

        if (!tagId) {
            return res.status(400).json({ message: 'RFID tag ID is required' });
        }

        // Lookup student details from StudentMapping collection
        const student = await StudentMapping.findOne({ tagId });

        if (!student) {
            return res.status(404).json({ message: 'No student found for the given RFID tag ID' });
        }

        // Check if attendance already exists for today
        const today = new Date().toISOString().split('T')[0];
        const existingRecord = await Rfid.findOne({ tagId, timestamp: { $gte: new Date(today) } });

        if (existingRecord) {
            return res.status(200).json({ message: 'Attendance already marked for today', data: existingRecord });
        }

        // Create attendance record
        const newRecord = new Rfid({
            tagId,
            studentId: student.studentId,
            studentName: student.studentName,
            status: 'Present',
            inTime: new Date().toLocaleTimeString(),
            outTime: null,
        });

        await newRecord.save();

        res.status(201).json({ message: 'Attendance record saved successfully', data: newRecord });
    } catch (error) {
        res.status(500).json({ message: 'Error saving attendance record', error });
    }
});

// GET endpoint to retrieve all attendance records
app.get('/attendance', async (req, res) => {
    try {
        const records = await Rfid.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving attendance records', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});