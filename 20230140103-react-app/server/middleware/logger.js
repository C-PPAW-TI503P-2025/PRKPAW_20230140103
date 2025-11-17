// middleware/logger.js
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../server.log');

const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFileSync(logFile, log);
  console.log(log.trim());
  next();
};

module.exports = logger;
