const fs = require('fs');
const readline = require('readline');
const { parentPort, workerData } = require('worker_threads');

const { logFile, targetDate, start, end } = workerData;

async function processChunk() {
    const stream = fs.createReadStream(logFile, { start, end, encoding: 'utf-8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    let logs = [];

    for await (const line of rl) {
        if (line.startsWith(targetDate)) {
            logs.push(line);
        }
    }

    parentPort.postMessage(logs);
}

processChunk().catch(err => parentPort.postMessage({ error: err.message }));
