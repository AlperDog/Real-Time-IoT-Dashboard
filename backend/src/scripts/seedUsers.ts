import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { UserRole, Permission } from '../sharedTypes';

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iot-dashboard';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Create demo users
    const users = [
      {
        email: 'admin@iot.com',
        password: 'admin123',
        name: 'Admin User',
        role: UserRole.ADMIN,
        permissions: Object.values(Permission)
      },
      {
        email: 'operator@iot.com',
        password: 'operator123',
        name: 'Operator User',
        role: UserRole.OPERATOR,
        permissions: [
          Permission.READ_DEVICES,
          Permission.WRITE_DEVICES,
          Permission.READ_DATA,
          Permission.WRITE_DATA,
          Permission.READ_ALERTS,
          Permission.MANAGE_ALERTS
        ]
      },
      {
        email: 'viewer@iot.com',
        password: 'viewer123',
        name: 'Viewer User',
        role: UserRole.VIEWER,
        permissions: [
          Permission.READ_DEVICES,
          Permission.READ_DATA,
          Permission.READ_ALERTS
        ]
      }
    ];

    // Hash passwords and create users
    for (const userData of users) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword,
        isActive: true,
        emailVerified: true
      });

      await user.save();
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }

    console.log('\n🎉 Demo users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@iot.com / admin123');
    console.log('Operator: operator@iot.com / operator123');
    console.log('Viewer: viewer@iot.com / viewer123');

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

// Run the seed function
if (require.main === module) {
  seedUsers();
}

export default seedUsers; 