module.exports = (cluster = [], options = {}) => {
  if (options.Rayo && typeof options.Rayo === 'function') {
    const app = new options.Rayo({ port: 31000, cluster: false });
    const handler = (req, res) => {
      const worker = cluster.workers[parseInt(req.params.worker, 10)];
      if (!worker) {
        return res.end(`Worker ${req.params.workerId} does not exist.`);
      }

      return worker.send(req.params.cmd || 'health', (data) => {
        console.log(data);
        res.end('Done');
      });
    };

    app.get('/monitor/:worker/:cmd?', handler).start((address) => {
      console.log(`Monitor is up: ${address.port}`);
    });
  }
};
