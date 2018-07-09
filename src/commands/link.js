const emoji = require('node-emoji');
const path = require('path');

const exec =  require('child_process').exec;
const cli = require('clui');
const logger = require('../services/logger');
const configSvc = require('../services/config');

const spinner = cli.Spinner;

const createScript = (dotfile) => {
  const { target, source } = dotfile;
  return `
    mv ${target} ${target}.bkp
    ln -s ${path.resolve(source)} ${target}
  `;
}

const linkFile = async (file) => {
  const progressLogger = new spinner(file.label);
  progressLogger.start();
  await new Promise((resolve) => {

    exec(createScript(file), (err, stdout, _stderr) => {
      const status = emoji.get(err ? ':x:' : ':heavy_check_mark:');
      logger.log(`${status}  ${file.label}`);
      progressLogger.stop();
      resolve();
    });
  });
}

const link = async (cmd) => {
  try {
    const config = await configSvc.loadConfig(cmd.config);
    for (let file of config.dotfiles) {
      await linkFile(file);
    };
  } catch (e) {
    logger.log(e);
  }
};

module.exports = link;