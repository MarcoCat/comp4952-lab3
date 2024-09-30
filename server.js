// Import required modules
const http = require('http');
const { ServerController } = require('./modules/ServerController');

// Create an instance of ServerController
const serverController = new ServerController();

// Create the HTTP server and pass the request handling to the controller
const server = http.createServer((req, res) => {
  serverController.handleRequest(req, res);
});

// Define the port to listen on (use environment variable PORT or default to 3000)
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});