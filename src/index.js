#!/usr/bin/env node

const program = require('commander');
const { link, install } = require('./commands');

program
  .command('link')
  .option('-c, --config <path>', 'path to your config file')
  .action(link);

program
  .command('install')
  .option('-c, --config <path>', 'path to your config file')
  .action(install);

program.parse(process.argv);