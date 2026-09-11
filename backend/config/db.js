const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      try {
        // Try local MongoDB first with short timeout
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/rentease', {
          serverSelectionTimeoutMS: 2000,
        });
        console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
        return;
      } catch (err) {
        console.log('Local MongoDB not found. Starting in-memory MongoMemoryServer...');
        mongod = await MongoMemoryServer.create({
          binary: { version: '6.0.14' },
        });
        mongoUri = mongod.getUri();
      }
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected (In-Memory/Cloud): ${conn.connection.host}`);

    // Auto-seed initial demo data if database is empty
    const User = require('../models/User');
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('Database empty. Running automatic seed function...');
      await autoSeed();
    }
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const autoSeed = async () => {
  const User = require('../models/User');
  const Property = require('../models/Property');
  const Favorite = require('../models/Favorite');
  const Application = require('../models/Application');
  const Rental = require('../models/Rental');
  const RentPayment = require('../models/RentPayment');
  const MaintenanceRequest = require('../models/MaintenanceRequest');
  const Notification = require('../models/Notification');

  // Create Users
  const admin = await User.create({
    name: 'Anjali Malhotra (Admin)',
    email: 'admin.anjali@gmail.com',
    password: 'Password123!',
    role: 'admin',
    phone: '+91 98711 00998',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  });

  const owner1 = await User.create({
    name: 'Satveer Singh',
    email: 'satveer.singh92@gmail.com',
    password: 'Password123!',
    role: 'owner',
    phone: '+91 98114 56789',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  });

  const owner2 = await User.create({
    name: 'Rohit Verma',
    email: 'rohit.verma@gmail.com',
    password: 'Password123!',
    role: 'owner',
    phone: '+91 98991 23456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  });

  const tenant1 = await User.create({
    name: 'Deepanshu Singh',
    email: 'deepanshusingh542005@gmail.com',
    password: 'Password123!',
    role: 'tenant',
    phone: '+91 98102 34567',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  });

  const tenant2 = await User.create({
    name: 'Priya Sharma',
    email: 'priya.sharma94@gmail.com',
    password: 'Password123!',
    role: 'tenant',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  });

  // Create Properties
  const prop1 = await Property.create({
    title: 'Spacious 2 BHK Builder Floor in Rajendra Nagar',
    description: 'Beautiful 2 BHK builder floor with marble flooring, modular kitchen, dedicated car parking, 24x7 water supply, and close to Metro station.',
    type: 'builder_floor',
    address: { street: 'Sector 3, Rajendra Nagar', city: 'Ghaziabad', state: 'UP', zipcode: '201005' },
    rentAmount: 14500,
    depositAmount: 29000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 950,
    amenities: ['Parking', 'Modular Kitchen', 'Balcony', '24/7 Water Supply', 'High-Speed Wifi'],
    images: [
      '/src/assets/Property1.jpg',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    owner: owner1._id,
    verificationStatus: 'approved',
    verifiedBy: admin._id,
    status: 'rented',
  });

  const prop2 = await Property.create({
    title: 'Modern 3 BHK Flat in Gated Society',
    description: 'Charming 3 BHK flat in Indirapuram with modern wooden wardrobes, 2 balconies, power backup, clubhouse access, and round-the-clock security.',
    type: 'flat_apartment',
    address: { street: 'Ahinsa Khand 2, Indirapuram', city: 'Ghaziabad', state: 'UP', zipcode: '201014' },
    rentAmount: 24000,
    depositAmount: 48000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqFt: 1450,
    amenities: ['Power Backup', 'Gated Security', 'Lift', 'Clubhouse', 'Gym', 'Covered Parking'],
    images: [
      '/src/assets/Property2.jpg.avif',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    owner: owner1._id,
    verificationStatus: 'approved',
    verifiedBy: admin._id,
    status: 'available',
  });

  const prop3 = await Property.create({
    title: 'Independent 3 BHK House with Private Roof Terrace',
    description: 'Spacious independent house located in a quiet green lane in Sector 4 Vaishali. Includes private terrace garden, garage, and updated kitchen.',
    type: 'independent_house',
    address: { street: 'Sector 4, Vaishali', city: 'Ghaziabad', state: 'UP', zipcode: '201010' },
    rentAmount: 28500,
    depositAmount: 30000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1800,
    amenities: ['Private Terrace', 'Garage', 'Garden', 'Geyser', 'Security System'],
    images: [
      '/src/assets/Property1.jpg',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    owner: owner2._id,
    verificationStatus: 'approved',
    verifiedBy: admin._id,
    status: 'available',
  });

  const prop4 = await Property.create({
    title: 'Compact 1 BHK Well-Ventilated Apartment',
    description: 'Affordable and cozy 1 BHK apartment in Raj Nagar Extension with lift facility, modular kitchen, and easy connectivity to main highway.',
    type: 'flat_apartment',
    address: { street: 'Main Road, Raj Nagar Extension', city: 'Ghaziabad', state: 'UP', zipcode: '201017' },
    rentAmount: 9500,
    depositAmount: 10000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 620,
    amenities: ['Lift', 'Parking', 'Modular Kitchen', 'Power Backup', 'Security Guard'],
    images: [
      '/src/assets/Property2.jpg.avif',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    ],
    owner: owner2._id,
    verificationStatus: 'approved',
    verifiedBy: admin._id,
    status: 'available',
  });

  const prop5 = await Property.create({
    title: 'Sunlit 2 BHK Premium Flat in Golf Course Road',
    description: 'Modern 2 BHK apartment in Sector 54 Gurgaon with modular kitchen, wooden flooring in master bedroom, basement parking, power backup, and 24x7 security.',
    type: 'flat_apartment',
    address: { street: 'Sector 54, Golf Course Road', city: 'Gurgaon', state: 'HR', zipcode: '122002' },
    rentAmount: 32000,
    depositAmount: 64000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1250,
    amenities: ['Basement Parking', 'Power Backup', 'Modular Kitchen', 'Lift', 'Clubhouse', '24/7 Security'],
    images: ['/src/assets/Property3.webp'],
    owner: owner1._id,
    verificationStatus: 'approved',
    verifiedBy: admin._id,
    status: 'available',
  });

  const prop6 = await Property.create({
    title: 'Luxury 4 BHK Independent Villa with Lawn',
    description: 'Extensive 4 BHK duplex villa in Sector 62 Noida featuring private lawn, dual car garage, servant room, solar water heater, and 24/7 gated security.',
    type: 'villa',
    address: { street: 'Sector 62', city: 'Noida', state: 'UP', zipcode: '201301' },
    rentAmount: 38500,
    depositAmount: 77000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 2400,
    amenities: ['Private Lawn', 'Garage', 'Solar Geyser', 'Servant Quarter', 'Security System'],
    images: ['/src/assets/Property4.avif'],
    owner: owner2._id,
    verificationStatus: 'approved',
    verifiedBy: admin._id,
    status: 'available',
  });

  const prop7 = await Property.create({
    title: 'Cozy 1 BHK Builder Floor Flat near Metro',
    description: 'Well-maintained 1 BHK builder floor in Lajpat Nagar II Delhi with Wardrobe, RO Water purifier, geyser, separate balcony, and 2-minute walk to Lajpat Nagar Metro.',
    type: 'builder_floor',
    address: { street: 'Lajpat Nagar II', city: 'Delhi', state: 'Delhi', zipcode: '110024' },
    rentAmount: 18000,
    depositAmount: 36000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 580,
    amenities: ['RO Purifier', 'Balcony', 'Geyser', 'Metro Connectivity', 'Furnished Wardrobe'],
    images: ['/src/assets/Property5.webp'],
    owner: owner1._id,
    verificationStatus: 'approved',
    verifiedBy: admin._id,
    status: 'available',
  });

  await Favorite.create({ tenant: tenant1._id, property: prop2._id });

  const app1 = await Application.create({
    property: prop1._id,
    tenant: tenant1._id,
    owner: owner1._id,
    status: 'approved',
    moveInDate: new Date('2026-09-01'),
    leaseTermMonths: 12,
    occupants: 2,
    monthlyIncome: 12000,
    notes: 'Software engineer at tech firm. Non-smoker, clean rental history.',
  });

  await Application.create({
    property: prop3._id,
    tenant: tenant2._id,
    owner: owner2._id,
    status: 'pending',
    moveInDate: new Date('2026-09-15'),
    leaseTermMonths: 12,
    occupants: 1,
    monthlyIncome: 7500,
    notes: 'Looking for a studio close to downtown office.',
  });

  const rental1 = await Rental.create({
    property: prop1._id,
    tenant: tenant1._id,
    owner: owner1._id,
    application: app1._id,
    rentAmount: prop1.rentAmount,
    depositAmount: prop1.depositAmount,
    startDate: new Date('2026-08-01'),
    endDate: new Date('2027-08-01'),
    paymentDueDay: 1,
    status: 'active',
  });

  await RentPayment.create({
    rental: rental1._id,
    property: prop1._id,
    tenant: tenant1._id,
    owner: owner1._id,
    amount: prop1.rentAmount,
    dueDate: new Date('2026-08-01'),
    paidDate: new Date('2026-08-02'),
    paymentMethod: 'Bank Transfer',
    status: 'paid',
    transactionId: 'TXN-902184920',
    notes: 'August 2026 rent paid on time.',
  });

  await RentPayment.create({
    rental: rental1._id,
    property: prop1._id,
    tenant: tenant1._id,
    owner: owner1._id,
    amount: prop1.rentAmount,
    dueDate: new Date('2026-09-01'),
    status: 'due',
    notes: 'September 2026 rent payment due.',
  });

  await MaintenanceRequest.create({
    rental: rental1._id,
    property: prop1._id,
    tenant: tenant1._id,
    owner: owner1._id,
    title: 'Kitchen Sink Faucet Leaking',
    description: 'Minor water drip under the main kitchen sink after running hot water.',
    category: 'plumbing',
    priority: 'medium',
    status: 'in_progress',
    images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80'],
    resolutionNotes: 'Plumber scheduled for Friday 10:00 AM.',
  });

  await Notification.create({
    recipient: admin._id,
    sender: owner2._id,
    title: 'New Property Pending Verification',
    message: `Owner ${owner2.name} submitted "${prop4.title}" for verification.`,
    type: 'verification',
    link: '/admin/verification',
  });

  await Notification.create({
    recipient: tenant1._id,
    sender: owner1._id,
    title: 'Application Approved! 🎉',
    message: `Your rental application for "${prop1.title}" was approved. Active lease created!`,
    type: 'application',
    link: '/tenant/rental',
  });

  console.log('Automatic Seeding Completed Successfully!');
};

module.exports = connectDB;
