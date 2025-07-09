import mongoose from 'mongoose';

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
});

afterAll(async () => {
  // Cleanup after all tests
  await mongoose.disconnect();
});

// Global test teardown
afterEach(async () => {
  // Clean up all collections after each test
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}); 