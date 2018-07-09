const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const getPath = (cmd) =>
  path.resolve(
    cmd || path.join(
      process.cwd(),
      'dotty.config.json'));

const loadConfig = (input) =>
  new Promise((resolve, reject) => {
    const filePath = getPath(input);
    const exists = fs.existsSync(filePath);

    if (!fs.existsSync(filePath)) {
      return reject('Config file not found: ' + filePath);
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject('Could not read config file.');
      }
      return resolve(JSON.parse(data));
    });
  });

module.exports = {
  getPath,
  loadConfig,
};