import axios from 'axios';

const API_URL = process.env.API_URL || 'http://backend:3001/api';

async function seedDevices() {
  for (let i = 1; i <= 10; i++) {
    try {
      await axios.post(`${API_URL}/devices`, {
        id: `test-device-${i}`,
        name: `Test Device ${i}`,
        type: 'sensor',
        location: 'Test Location',
        status: 'online',
      });
      console.log(`Device ${i} created.`);
    } catch (err) {
      const error = err as any;
      console.error(`Device ${i} creation failed:`, error.response?.data || error.message);
    }
  }
}

// async function seedSensors() {
//   for (let i = 1; i <= 10; i++) {
//     try {
//       await axios.post(`${API_URL}/sensors`, {
//         name: `Test Sensor ${i}`,
//         deviceId: i, // Varsayım: deviceId 1-10 arası
//         type: 'temperature',
//         value: Math.floor(Math.random() * 100),
//       });
//       console.log(`Sensor ${i} created.`);
//     } catch (err) {
//       const error = err as any;
//       console.error(`Sensor ${i} creation failed:`, error.response?.data || error.message);
//     }
//   }
// }

async function main() {
  await seedDevices();
  // await seedSensors();
  console.log('Test data seeding completed.');
}

main(); 