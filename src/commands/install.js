const exec = require('child_process').exec;
const cli = require('clui');
const emoji = require('node-emoji');

const configSvc = require('../services/config');
const logger = require('../services/logger');

const spinner = cli.Spinner;
const homebrewUrl =
  'https://raw.githubusercontent.com/Homebrew/install/master/install';

const installBrewIfMissing = async () =>
  await execWithLog(`
    which brew || echo | ruby -e "$(curl -fsSL ${homebrewUrl})"
  `, 'homebrew');

const isAlreadyInstalled = async (item) =>
  await execCheck(item.customCheck || `which ${item.name}`)

const installCollection = async (collection, cmd) => {
  for (let item of collection) {
    if (await isAlreadyInstalled(item)) {
      logger.log(`${emoji.get(':heavy_check_mark:')}  ${item.name} (skipped)`);
    } else {
      if (item.prepare) {
        await execWithLog(item.prepare, item.name + ' (prep)');
      }
      await execWithLog(`${cmd} ${item.name}`, item.name);
    }

    if (item.extensions) {
      for (let extension of item.extensions) {
        await execWithLog(
          `${item.extensionInstallCmd} ${extension}`,
          '+ ext: ' + extension
        );
      }
    }
  }
}

const execCheck = async (cmd) => {
  return new Promise((resolve) => {
    exec(cmd, (err) => {
      resolve(err === null);
    })
  })
}

const execWithLog = async (cmd, msg) =>
  new Promise((resolve) => {
    const progressBar = new spinner(msg);
    progressBar.start();
    exec(cmd, (err, stdout, _stderr) => {
      const status = emoji.get(err ? ':x:' : ':heavy_check_mark:');
      progressBar.stop();
      logger.log(`${status}  ${msg} ${err || ''}`);
      resolve();
    });
  });

  module.exports = async (cmd) => {
    const config = await configSvc.loadConfig(cmd.config);
    const { brews, casks } = config;

    await installBrewIfMissing();

    logger.log(`${emoji.get(':beer:')}  installing brews`);
    await installCollection(config.brews, 'brew install', '');

    logger.log(`${emoji.get(':oil_drum:')}  installing casks`);
    await installCollection(config.casks, 'brew cask install');

  }

