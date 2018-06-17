const cluster = require('cluster');
const cpus = require('os').cpus();
const pino = require('pino');
const monitor = require('./monitor');

const log = pino({
  name: process.env.STORM_LOG_NAME || 'Rayo',
  level: process.env.STORM_LOG_LEVEL || 'info',
  prettyPrint: process.env.STORM_LOG_PRETTY === 'true'
});

class Storm {
  constructor(work = null, options) {
    if (!work) {
      throw new Error('You need to provide a boot function.');
    }

    this.work = work;
    this.revive = this.revive.bind(this);
    this.stop = this.stop.bind(this);
    this.start(options);
  }

  start(options) {
    if (cluster.isWorker) {
      this.work(cluster.worker.process.pid);
      /**
       * This is a message sent from the master process.
       */
      process.on('message', (cmd, callback) => {
        console.log(cmd, callback);
        switch (cmd) {
          case 'health': // callback({ pid: process.pid, memory: process.memoryUsage() });
            break;
          default:
        }
      });
		  /*
      setInterval(function() {
        process.send({ pid: process.pid, memory: process.memoryUsage() });
		  }, 1000);
      */
    } else {
      this.up = true;
      this.isMaster = true;
      (options.onMaster || function onMaster() {})();
      cluster.on('exit', this.revive);
      process.on('SIGINT', this.stop).on('SIGTERM', this.stop);
      let processes = options.workers || cpus.length;
      while (processes--) {
        const worker = cluster.fork();
        worker.on('message', (msg) => {
			    console.log('Worker: ' + msg);
		    });
      }

      monitor(cluster, options);
    }
  }

  stop() {
    this.up = false;
    const workers = Object.keys(cluster.workers).length;
    for (let wrk = workers; wrk > 0; wrk -= 1) {
      if (cluster.workers[wrk]) {
        cluster.workers[wrk].process.kill();
        cluster.workers[wrk].kill();
      }
    }

    log.warn('The cluster has been terminated by the system.');
    process.exit();
  }

  revive(worker, code, signal) {
    if (this.up) {
      log.warn(`Worker ${worker.process.pid} died, with ${signal}.`);
      cluster.fork();
    }
  }
}

module.exports = (boot = null, options = {}) => new Storm(boot, options);
