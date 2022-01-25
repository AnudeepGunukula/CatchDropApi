const http = require('http');
const app = require('./app');

const port = 3000;

const server = http.createServer(app);

console.log("server is up and running");

server.listen(port);
