const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
    try {
        console.log("==========================================");
        console.log("   SATTVA YOGA COMPREHENSIVE E2E TEST     ");
        console.log("==========================================\\n");

        // --- PHASE 1: ADMIN OPERATIONS ---
        console.log("--- PHASE 1: ADMIN OPERATIONS ---");

        console.log("1. Admin Login...");
        const adminRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@sattvayoga.com',
            password: 'password123'
        });
        const adminToken = adminRes.data.token;
        console.log(`✅ Admin logged in. Token acquired.\\n`);

        console.log("2. Admin Creating a Class...");
        const classData = {
            title: `E2E Sunrise Flow ${Date.now()}`,
            description: "A beautiful morning flow for testing integration.",
            duration: 60,
            schedule: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            difficulty: "Beginner",
            maxSlots: 20,
            feePerSession: 500,
            totalSessions: 10
        };
        const createClassRes = await axios.post(`${API_URL}/classes`, classData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const testClassId = createClassRes.data._id;
        console.log(`✅ Class created successfully. ID: ${testClassId} (Fee: 500/session)\\n`);

        console.log("2.5. Admin Configuring Payment Settings...");
        await axios.put(`${API_URL}/admin-settings`, {
            adminName: "Sattva Admin",
            upiId: "9373136747@ybl"
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Admin Payment Settings configured.\\n`);


        // --- PHASE 2: USER OPERATIONS ---
        console.log("--- PHASE 2: USER OPERATIONS ---");

        console.log("3. User Registration...");
        const userData = {
            name: 'E2E Integration Student',
            email: `integration_${Date.now()}@example.com`,
            password: 'password123',
            phone: '5551234567'
        };
        const regRes = await axios.post(`${API_URL}/auth/register`, userData);
        const userToken = regRes.data.token;
        const testUserId = regRes.data._id;
        console.log(`✅ User registered successfully. ID: ${testUserId}\\n`);

        console.log("4. User Gets Available Classes...");
        const getClassesRes = await axios.get(`${API_URL}/classes`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const availableClasses = getClassesRes.data;
        const foundClass = availableClasses.find(c => c._id === testClassId);
        if (foundClass) {
            console.log(`✅ User can see the newly created admin class.\\n`);
        } else {
            throw new Error("User cannot see the newly created class!");
        }

        console.log("5. User Books the Class (with mock payment proof)...");
        const bookRes = await axios.post(`${API_URL}/bookings`, {
            classId: testClassId,
            sessions: 3,
            paymentProof: "/mock-proof.png"
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const testBookingId = bookRes.data.booking._id;
        console.log(`✅ User requested booking (3 sessions). Initial Status: ${bookRes.data.booking.status}. Booking ID: ${testBookingId}\\n`);

        console.log("6. User Fetches My Bookings...");
        const myBookingsRes = await axios.get(`${API_URL}/bookings/my-bookings`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const myBookings = myBookingsRes.data.data;
        if (myBookings.find(b => b._id === testBookingId)) {
            console.log(`✅ User sees their booking in dashboard.\\n`);
        } else {
            throw new Error("User booking not showing in their dashboard!");
        }


        // --- PHASE 3: INTEGRATION & CROSS-CHECKS ---
        console.log("--- PHASE 3: INTEGRATION & CROSS-CHECKS ---");

        console.log("7. Admin Checks Booking Visibility...");
        const adminBookingsRes = await axios.get(`${API_URL}/bookings`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const adminBookings = adminBookingsRes.data.data;
        const verifiedBooking = adminBookings.find(b => b._id === testBookingId);
        if (verifiedBooking && verifiedBooking.userId.name === userData.name && verifiedBooking.totalAmount === 1500 && verifiedBooking.paymentProof) {
            console.log(`✅ Admin can see the user's booking WITH populated User Data, Amount Due (1500), and Payment Proof!\\n`);
        } else {
            throw new Error("Admin cannot see the populated booking data or payment info is missing!");
        }

        console.log("7.5. Admin Verifies (Confirms) Payment...");
        await axios.put(`${API_URL}/bookings/${testBookingId}/verify`, { status: 'confirmed' }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Admin successfully VERIFIED and CONFIRMED the payment.\\n`);

        console.log("8. Admin Marks Attendance...");
        // Mark present for this specific class and user
        const attendanceData = {
            classId: testClassId,
            date: new Date().toISOString(),
            userId: testUserId,
            status: 'present'
        };
        await axios.post(`${API_URL}/attendance`, attendanceData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Admin successfully marked attendance for the user.\\n`);

        console.log("9. User Checks Attendance Tracker...");
        const userAttendanceRes = await axios.get(`${API_URL}/attendance`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const userAttendance = userAttendanceRes.data;
        require('fs').writeFileSync('debug.json', JSON.stringify(userAttendance, null, 2));
        const markedRecord = userAttendance.find(a => a.classId?._id === testClassId);
        if (markedRecord && markedRecord.status === 'present') {
            console.log(`✅ User can see their 'present' attendance mark!\\n`);
        } else {
            throw new Error("User attendance not reflecting Admin's mark!");
        }

        console.log("10. Admin Sends Notification...");
        await axios.post(`${API_URL}/notifications`, {
            userId: testUserId,
            message: "E2E Test: Class location has changed to Studio B."
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Admin sent target notification.\\n`);

        console.log("11. User Checks Notifications...");
        const userNotifsRes = await axios.get(`${API_URL}/notifications`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const userNotifs = userNotifsRes.data;
        if (userNotifs.length > 0 && userNotifs[0].message.includes("Studio B")) {
            console.log(`✅ User successfully received Admin's notification in their drawer.\\n`);
        } else {
            throw new Error("User did not receive the notification.");
        }

        console.log("12. Admin Fetches Dashboard Analytics...");
        const dashboardStatsRes = await axios.get(`${API_URL}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Admin Dashboard Stats loaded: ${dashboardStatsRes.data.totalUsers} users, ${dashboardStatsRes.data.totalClasses} classes.\\n`);


        // --- PHASE 4: TEARDOWN (CLEANUP) ---
        console.log("--- PHASE 4: TEARDOWN (CLEANUP) ---");

        console.log("13. Admin Cancels Booking...");
        await axios.delete(`${API_URL}/bookings/admin/${testBookingId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Admin successfully cancelled the booking.\\n`);

        console.log("14. Admin Deletes Class...");
        await axios.delete(`${API_URL}/classes/${testClassId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Admin successfully deleted test class.\\n`);

        console.log("15. Admin Deletes User...");
        await axios.delete(`${API_URL}/users/${testUserId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Admin successfully deleted test user account.\\n`);


        console.log("==========================================");
        console.log(" ALL TESTS PASSED SUCCESSFULLY! 🚀");
        console.log(" Integration between User & Admin verified.");
        console.log("==========================================");

    } catch (error) {
        console.error("\\n❌ TEST FAILED!");
        if (error.response) {
            console.error(`Status ${error.response.status}:`, error.response.data);
        } else {
            console.error(error.stack || error.message);
        }
    }
};

runTests();
