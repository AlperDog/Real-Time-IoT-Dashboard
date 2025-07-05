@echo off
echo 🚀 Starting IoT Dashboard Project...

echo.
echo 📦 Starting Backend...
cd backend
start "Backend" cmd /k "npm run dev"

echo.
echo 📦 Starting Frontend...
cd ../frontend
start "Frontend" cmd /k "npm start"

echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo ✅ Services should be starting up!
echo.
echo 📊 Frontend: http://localhost:3000
echo 🔌 Backend API: http://localhost:3001
echo 🏥 Health Check: http://localhost:3001/health
echo.
echo 🧪 Running tests...
node test-project.js

echo.
echo 🎉 Project is ready!
echo Press any key to exit...
pause > nul 