// https://anthonymineo.com/docker-healthcheck-for-your-node-js-app/
const http = require('http');
const options = {
  host: '0.0.0.0',
  path: process.env.STATUS_PATH,
  port: process.env.PORT,
  timeout: 2000,
};

const healthCheck = http.request(options, (res) => {
  console.log(`HEALTHCHECK STATUS: ${res.statusCode}`);
  // 200: We are ready to receieve requests.
  // 202: We are currently starting up.
  if (res.statusCode == 200 || res.statusCode == 202) {
    process.exit(0);
  } else if (res.statusCode == 500) {
    process.exit(1);
  }
});

healthCheck.on('error', function (err) {
  console.error('ERROR');
  process.exit(1);
});

healthCheck.end();
