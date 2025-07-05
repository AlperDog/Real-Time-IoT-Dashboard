const http = require("http");

// Test backend health endpoint
function testBackend() {
  const options = {
    hostname: "localhost",
    port: 3001,
    path: "/health",
    method: "GET",
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Backend Status: ${res.statusCode}`);
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log("📊 Backend Response:", JSON.parse(data));
    });
  });

  req.on("error", (err) => {
    console.log("❌ Backend Error:", err.message);
  });

  req.end();
}

// Test frontend
function testFrontend() {
  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/",
    method: "GET",
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Frontend Status: ${res.statusCode}`);
  });

  req.on("error", (err) => {
    console.log("❌ Frontend Error:", err.message);
  });

  req.end();
}

console.log("🚀 Testing IoT Dashboard Project...\n");

setTimeout(() => {
  console.log("🔍 Testing Backend...");
  testBackend();
}, 1000);

setTimeout(() => {
  console.log("\n🔍 Testing Frontend...");
  testFrontend();
}, 2000);

setTimeout(() => {
  console.log("\n📋 Test Summary:");
  console.log("Frontend: http://localhost:3000");
  console.log("Backend API: http://localhost:3001");
  console.log("Health Check: http://localhost:3001/health");
  console.log("Devices API: http://localhost:3001/api/devices");
}, 3000);
