#!/bin/bash

# Test marking attendance with RFID tag ID
curl -X POST http://localhost:3000 /attendance \
-H "Content-Type: application/json" \
-d '{"tagId": "RFID001"}'

# Test listing all attendance records
curl -X GET http://localhost:3000 /attendance