const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
    try {
        console.log("--- Starting E2E Integration Tests ---");

        // 1. Register a new Test User
        const userData = {
            name: 'E2E Test Student',
            email: `test_student_${Date.now()}@example.com`,
            password: 'password123',
            phone: '9998887777'
        };

        console.log("\\n1. Registering new student...");
        const regRes = await axios.post(`${API_URL}/auth/register`, userData);
        const userToken = regRes.data.token;
        console.log(`Student registered successfully: ${userData.email}`);

        // 2. Fetch Available Classes
        console.log("\\n2. Fetching available classes...");
        const classesRes = await axios.get(`${API_URL}/classes`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const classes = classesRes.data;

        if (classes.length === 0) {
            console.log("No classes available to book! Please seed classes first.");
            process.exit(1);
        }
        const targetClassId = classes[0]._id;
        console.log(`Found class: ${classes[0].title}`);

        // 3. User Books the Class
        console.log("\\n3. Student booking the class...");
        await axios.post(`${API_URL}/bookings`, { classId: targetClassId }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log("Class booked successfully!");

        // 4. Verify User Dashboard Bookings
        console.log("\\n4. Verifying student's My Bookings dashboard...");
        const userBookings = await axios.get(`${API_URL}/bookings/my-bookings`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        if (userBookings.data.data.length > 0) {
            console.log("SUCCESS: Student can see their own booking on dashboard.");
        } else {
            throw new Error("Student cannot see their booking!");
        }

        // 5. Admin Login
        console.log("\\n5. Logging in as Admin...");
        const adminRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@sattvayoga.com',
            password: 'password123'
        });
        const adminToken = adminRes.data.token;
        console.log(`Admin login successful. Role: ${adminRes.data.role}`);

        // 6. Admin Verifies Booking Visibility
        console.log("\\n6. Admin fetching all bookings view...");
        const adminBookings = await axios.get(`${API_URL}/bookings`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        // Find our specific test student's booking
        const testBooking = adminBookings.data.data.find(b => b.userId?.email === userData.email);

        if (testBooking) {
            console.log(`SUCCESS: Admin can see the new booking!`);
            console.log(`Verified Student Name visible to Admin: ${testBooking.userId.name}`);
            console.log(`Verified Student Email visible to Admin: ${testBooking.userId.email}`);
            console.log(`Verified Class Name visible to Admin: ${testBooking.classId.title}`);
        } else {
            throw new Error("FAILURE: Admin cannot see the booking or the userId population failed!");
        }

        // 7. Admin Cancels Booking (Teardown test)
        console.log("\\n7. Admin forcefully cancelling the booking to test permissions...");
        await axios.delete(`${API_URL}/bookings/admin/${testBooking._id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log("SUCCESS: Admin successfully cancelled the booking.");

        console.log("\\n--- All E2E Tests Passed Perfectly! ---");

    } catch (error) {
        console.error("\\nTEST FAILED!");
        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

runTests();
