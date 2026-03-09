const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  try {
    console.log('--- Starting Backend E2E Tests ---');
    
    // 1. Register a new user
    console.log('1. Testing User Registration...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Yogi',
      email: `test${Date.now()}@yogi.com`,
      password: 'password123',
      phone: '1234567890'
    });
    console.log('   ✅ Registration successful');
    const token = registerRes.data.token;

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Fetch User Profile (GET /auth/me)
    console.log('2. Testing Get Profile...');
    const profileRes = await axios.get(`${API_URL}/auth/me`, config);
    console.log(`   ✅ Profile fetch successful (User: ${profileRes.data.name})`);

    // 3. Fetch Classes
    console.log('3. Testing Fetch Classes...');
    const classesRes = await axios.get(`${API_URL}/classes`, config);
    console.log(`   ✅ Fetched ${classesRes.data.length} classes`);
    
    if (classesRes.data.length === 0) {
        throw new Error("No classes found in DB. Did the seeder run?");
    }
    const classId = classesRes.data[0]._id;

    // 4. Create a Booking
    console.log('4. Testing Create Booking...');
    const bookingRes = await axios.post(`${API_URL}/bookings`, { classId }, config);
    console.log(`   ✅ Booking created successfully (ID: ${bookingRes.data.booking._id})`);
    const bookingId = bookingRes.data.booking._id;

    // 5. Fetch User Bookings
    console.log('5. Testing Get User Bookings...');
    const myBookingsRes = await axios.get(`${API_URL}/bookings/my-bookings`, config);
    console.log(`   ✅ Fetched ${myBookingsRes.data.count} bookings`);

    // 6. Fetch Notifications (Should have 1 from booking)
    console.log('6. Testing Get Notifications...');
    const notificationsRes = await axios.get(`${API_URL}/notifications`, config);
    console.log(`   ✅ Fetched ${notificationsRes.data.length} notifications`);

    // 7. Cancel Booking
    console.log('7. Testing Cancel Booking...');
    await axios.delete(`${API_URL}/bookings/${bookingId}`, config);
    console.log('   ✅ Booking cancelled successfully');

    // 8. Update Profile
    console.log('8. Testing Update Profile...');
    const updateRes = await axios.put(`${API_URL}/users/profile`, {
        name: 'Updated Yogi Name'
    }, config);
    console.log(`   ✅ Profile updated successfully (New Name: ${updateRes.data.name})`);

    console.log('--- All Backend Tests Passed! ---');

  } catch (error) {
    console.error('❌ Test Failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

runTests();
