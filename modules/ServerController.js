const url = require('url');
const fs = require('fs');
const { Utils } = require('./Utils');

class ServerController {
  constructor() {
    this.utils = new Utils();
    this.greetingMessage = '';
    this.loadGreetingMessage();
  }

  // Load the greeting message from the external JSON file
  loadGreetingMessage() {
    const greetingPath = './lang/en/en.json';
    fs.readFile(greetingPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading greeting message:', err);
        this.greetingMessage = 'Hello %1, What a beautiful day. Server current date and time is ';
      } else {
        this.greetingMessage = JSON.parse(data).greeting;
      }
    });
  }

  // Handle incoming HTTP requests
  handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/COMP4537/labs/3/getDate/') {
      this.handleGetDate(res, query);
    } else if (pathname === '/COMP4537/labs/3/writeFile/') {
      this.handleWriteFile(res, query);
    } else if (pathname === '/COMP4537/labs/3/readFile/file.txt') {
      this.handleReadFile(res);
    } else {
      this.handleNotFound(res);
    }
  }

  // Handle the /getDate/ endpoint
  handleGetDate(res, query) {
    const name = query.name || 'Marco';
    const currentDate = this.utils.getDate();
    const message = this.greetingMessage.replace('%1', name) + currentDate;
    const htmlResponse = `<p style="color: blue;">${message}</p>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlResponse);
  }

  // Handle the /writeFile/ endpoint
  handleWriteFile(res, query) {
    const text = query.text || '';
    const filePath = './file.txt';

    fs.appendFile(filePath, text + '\n', (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error writing to file.');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Appended "${text}" to file.txt`);
      }
    });
  }

  // Handle the /readFile/file.txt endpoint
  handleReadFile(res) {
    const filePath = './file.txt';

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Error: File "${filePath}" not found.`);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      }
    });
  }

  // Handle unknown routes
  handleNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
}

module.exports = { ServerController };
