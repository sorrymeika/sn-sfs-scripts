const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const { Server } = require('sonofs');

const cfg = {
    groupId: 1,
    serverId: 1,
    root: '/data/files/main',
    port: 8124,
    registry: {
        port: 8123
    }
};

if (cluster.isMaster) {
    Server.startMaster(cfg, () => {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
    });
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`, code, signal);
    });
} else {
    Server.startWorker(cfg);
}