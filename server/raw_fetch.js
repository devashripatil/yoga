const https = require('https');
const data = JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] });
const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB_g-himZYa4usSaSC4bxNyXl_0WN6HURQ',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};
const req = https.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', d => process.stdout.write(d));
});
req.on('error', error => console.error(error));
req.write(data);
req.end();
