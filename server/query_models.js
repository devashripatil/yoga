const https = require('https');
const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models?key=AIzaSyB_g-himZYa4usSaSC4bxNyXl_0WN6HURQ',
    method: 'GET'
};
const req = https.request(options, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => require('fs').writeFileSync('models.json', body));
});
req.on('error', error => console.error(error));
req.end();
