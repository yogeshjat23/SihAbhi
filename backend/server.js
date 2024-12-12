// const express = require('express');
// const http = require('http');
// const mqtt = require('mqtt');
// const socketIo = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'], 
//     credentials: true,
//   },
// }); 

// app.use(cors({
//   origin: 'http://localhost:3000', // Frontend origin
//   methods: ['GET', 'POST'],
//   credentials: true, // Allow credentials if needed
// }));
// // app.use(cors());

// // MQTT Broker settings
// const MQTT_BROKER = 'mqtt://broker.emqx.io';
// const MQTT_TOPIC = 'emqx/esp8266/tbfm';

// // Connect to the MQTT broker
// const mqttClient = mqtt.connect(MQTT_BROKER, {
//   username: 'emqx', 
//   password: 'public', 
// });

// mqttClient.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   mqttClient.subscribe(MQTT_TOPIC, (err) => {
//     if (err) {
//       console.error(`Failed to subscribe to topic ${MQTT_TOPIC}`, err);
//     } else {
//       console.log(`Subscribed to topic ${MQTT_TOPIC}`);
//     }
//   });
// });

// // Listen for messages from the MQTT broker
// mqttClient.on('message', (topic, message) => {
//   console.log(`Message received on topic ${topic}: ${message.toString()}`);
//   const data = message.toString();
//   // console.log(data);
//   // Send the message to connected frontend clients via Socket.io
//   io.emit('mqttData', data);
// });

// // Start the server
// const PORT = 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });










const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const socketIo = require('socket.io');
const cors = require('cors');
const XLSX = require('xlsx'); // Import xlsx library
const fs = require('fs'); // File system module to handle file operations

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'], 
    credentials: true,
  },
});

app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  methods: ['GET', 'POST'],
  credentials: true, // Allow credentials if needed
}));

// MQTT Broker settings
const MQTT_BROKER = 'mqtt://broker.emqx.io';
const MQTT_TOPIC = 'emqx/esp8266/tbfm';

// Connect to the MQTT broker
const mqttClient = mqtt.connect(MQTT_BROKER, {
  username: 'emqx', 
  password: 'public', 
});

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error(`Failed to subscribe to topic ${MQTT_TOPIC}`, err);
    } else {
      console.log(`Subscribed to topic ${MQTT_TOPIC}`);
    }
  });
});

app.use(express.json());

//login crendentials
const ADMIN_CREDENTIALS = {
  username: 'admin_motor',
  password: 'admin1234',
  
};

// Add a route for login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // If admin credentials match
    return res.status(200).json({ success: true, isAdmin: true });
  } else {
    // For all other users (clients)
    return res.status(200).json({ success: true, isAdmin: false });
  }
});





// Function to append data to sih_dataset.xlsx
const appendToExcel = (data) => {
  const filePath = './sih_dataset.xlsx';

  // Function to parse the sensor data from the MQTT string
  const parseSensorData = (dataString) => {
    const parsedData = {};
    const regex = /RPM:\s*([\d.]+),\s*Temperature:\s*([\d.]+)°C,\s*Peak Acceleration:\s*([\d.]+)\s*m\/s²,\s*Sound Voltage:\s*([\d.]+)V,\s*Volts:\s*([\d.]+)\s*V,\s*Current:\s*([\d.]+)\s*A,Power:\s*([\d.]+)\s*W,MotorID:\s*(\w+)/;
    const match = dataString.match(regex);

    if (match) {
      parsedData.RPM = parseFloat(match[1]);
      parsedData.Temperature = parseFloat(match[2]);
      parsedData.PeakAcceleration = parseFloat(match[3]);
      parsedData.SoundVoltage = parseFloat(match[4]);
      parsedData.Volts = parseFloat(match[5]);
      parsedData.Current = parseFloat(match[6]);
      parsedData.Power = parseFloat(match[7]);
      parsedData.MotorID = match[8];
    }

    return parsedData;
  };

  // Parse the incoming data
  const parsedData = parseSensorData(data);
  if (!parsedData.MotorID) {
    console.error('Failed to parse data:', data);
    return;
  }

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    // If the file doesn't exist, create it with a header row
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ['Timestamp', 'RPM', 'Temperature (°C)', 'Peak Acceleration (m/s²)', 'Sound Voltage (V)', 'Volts (V)', 'Current (A)', 'Power (W)', 'MotorID']
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filePath);
  }

  // Read the existing file
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Sheet1'];
  const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Append new data
  const timestamp = new Date().toISOString(); // Current timestamp
  existingData.push([
    timestamp,
    parsedData.RPM,
    parsedData.Temperature,
    parsedData.PeakAcceleration,
    parsedData.SoundVoltage,
    parsedData.Volts,
    parsedData.Current,
    parsedData.Power,
    parsedData.MotorID
  ]);

  // Write back to the file
  const updatedWorksheet = XLSX.utils.aoa_to_sheet(existingData);
  workbook.Sheets['Sheet1'] = updatedWorksheet;
  XLSX.writeFile(workbook, filePath);
};

// Listen for messages from the MQTT broker
mqttClient.on('message', (topic, message) => {
  console.log(`Message received on topic ${topic}: ${message.toString()}`);
  const data = message.toString();

  // Append the data to the Excel file
  appendToExcel(data);

  // Send the message to connected frontend clients via Socket.io
  io.emit('mqttData', data);
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

