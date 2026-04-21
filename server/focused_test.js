const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testGetPut = async () => {
    try {
        console.log('--- Testing GET and PUT APIs ---');

        // 1. Register/Login to get token
        console.log('1. Authenticating...');
        const authRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: `test_user_${Date.now()}@example.com`,
            password: 'password123',
            phone: '1234567890'
        });
        const token = authRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('   ✅ Authenticated successfully');

        // 2. Test GET (Profile)
        console.log('2. Testing GET /api/auth/me...');
        const getRes = await axios.get(`${API_URL}/auth/me`, config);
        console.log(`   ✅ GET Successful. Name: ${getRes.data.name}`);

        // 3. Test PUT (Update Profile)
        console.log('3. Testing PUT /api/users/profile...');
        const newName = 'Updated Test User';
        const putRes = await axios.put(`${API_URL}/users/profile`, { name: newName }, config);
        console.log(`   ✅ PUT Successful. New Name: ${putRes.data.name}`);

        if (putRes.data.name === newName) {
            console.log('\n--- ALL GET AND PUT TESTS PASSED! ---');
        } else {
            console.error('\n--- PUT TEST FAILED: Name not updated correctly ---');
        }
        process.exit(0);

    } catch (error) {
        console.error('--- Test Failed! ---');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
};

testGetPut();
