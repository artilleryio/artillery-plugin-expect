/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const debug = require('debug')('plugin:expect');
const chalk = require('chalk');
const urlparse = require('url').parse;

module.exports = {
  pretty: prettyPrint,
  json: jsonPrint
};

function prettyPrint(requestExpectations, req, res, userContext) {
  debug(
    chalk.blue('*', req.method, urlparse(req.url).path),
    req.name ? '- ' + req.name : ''
  );

  requestExpectations.results.forEach(result => {
    debug(
      `  ${result.ok ? chalk.green('ok') : chalk.red('not ok')} ${
        result.type
      } ${result.got} `
    );

    if (!result.ok) {
      debug('  expected:', result.expected);
      debug('       got:', result.got);

      debug(chalk.yellow('  Request params:'));
      debug(prepend(req.url, '    '));
      debug(prepend(JSON.stringify(req.json || '', null, 2), '    '));
      debug(chalk.yellow('  Headers:'));
      Object.keys(res.headers).forEach(function(h) {
        debug('  ', h, ':', res.headers[h]);
      });
      debug(chalk.yellow('  Body:'));
      debug(prepend(String(JSON.stringify(res.body, null, 2)), '    '));

      debug(chalk.yellow('  User variables:'));
      Object.keys(userContext.vars).filter(varName => varName !== '$processEnvironment').forEach(function(varName) {
        debug('    ', varName, ':', userContext.vars[varName]);
      });
    } else {
    }
  });
}

function jsonPrint(requestExpectations, req, res, userContext) {
  debug(JSON.stringify(requestExpectations));
}

function prepend(text, str) {
  return text
    .split('\n')
    .map(function(line) {
      return str + line;
    })
    .join('\n');
}
