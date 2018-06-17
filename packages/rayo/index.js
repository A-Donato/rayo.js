const http = require('http');
const parseurl = require('parseurl');
const storm = require('../plugins/storm');
const { parse } = require('querystring');
const Bridge = require('./bridge');

const end = (req, res, status, error) => {
  res.statusCode = status;
  res.setHeader('Content-Length', error.length);
  res.setHeader('Content-Type', 'text/plain');
  return res.end(error);
};

class Rayo extends Bridge {
  constructor(options) {
    super();
    ({
      port: this.port,
      host: this.host,
      cluster: this.cluster = true,
      onError: this.onError = null,
      notFound: this.notFound = null,
      server: this.server = null
    } = options);
    this.dispatch = this.dispatch.bind(this);
  }

  start(callback = function cb() {}) {
    const server = (workerPid = null) => {
      this.server = this.server || http.createServer();
      this.server.listen(this.port, this.host);
      this.server.on('request', this.dispatch);
      this.server.on('listening', () => {
        this.through();
        const address = this.server.address();
        address.workerePid = workerPid;
        callback(address);
      });
    };

    const a = this.cluster ? storm(server, { Rayo }) : server();
    console.log(a);

    return this.server;
  }

  dispatch(req, res) {
    const parsedUrl = parseurl(req);
    const route = this.fetch(req.method, parsedUrl.pathname);
    if (!route) {
      return this.notFound
        ? this.notFound(req, res)
        : end(req, res, 404, `${req.method} ${parsedUrl.pathname} is undefined.`);
    }

    req.params = route.params;
    req.pathname = parsedUrl.pathname;
    req.query = this.cache.queries[parsedUrl.query] || parse(parsedUrl.query);
    this.cache.queries[parsedUrl.query] = req.query;
    return this.step(req, res, route.stack.slice());
  }

  step(req, res, stack, error = null, statusCode = 400) {
    const fn = stack.shift();
    if (error) {
      return this.onError
        ? this.onError(error, req, res, fn)
        : end(req, res, statusCode, error);
    }

    if (fn) {
      return fn(req, res, this.step.bind(this, req, res, stack));
    }

    throw new Error('No handler to move to, the stack is empty.');
  }
}

module.exports = (options = {}) => new Rayo(options);
