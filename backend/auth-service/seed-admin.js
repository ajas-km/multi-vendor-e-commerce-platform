const { User, connectDB } = require('../shared/index.js');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb+srv://ecommerce-platform:567%40Ajas@cluster0.3htaf12.mongodb.net/multivendor?appName=Cluster0';

const seedAdmin = async () => {
  try {
    await connectDB(MONGO_URI);
    
    const email = 'demo_admin@example.com';
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('Admin already exists, clearing old data...');
      await User.deleteOne({ _id: user._id });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    user = await User.create({
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin account created:', user.email);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
