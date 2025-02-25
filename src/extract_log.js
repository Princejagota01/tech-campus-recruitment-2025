const fs = require('fs');
const os = require('os');
const { Worker } = require('worker_threads');
const path = require('path');

const NUM_WORKERS = os.cpus().length; // Utilize all CPU cores
const logFile = 'large_log.txt'; // Change this to your actual log file
const outputDir = 'output';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

if (process.argv.length !== 3) {
    console.error('Usage: node extract_logs.js <YYYY-MM-DD>');
    process.exit(1);
}

const targetDate = process.argv[2];

async function extractLogsParallel() {
    const fileSize = fs.statSync(logFile).size;
    const chunkSize = Math.ceil(fileSize / NUM_WORKERS);
    const workers = [];
    let completedWorkers = 0;
    let logResults = [];

    console.log(`\n Processing ${logFile} (~${(fileSize / 1e9).toFixed(2)} GB) using ${NUM_WORKERS} workers...\n`);

    for (let i = 0; i < NUM_WORKERS; i++) {
        const start = i * chunkSize;
        const end = (i + 1) * chunkSize - 1;

        workers.push(
            new Promise((resolve, reject) => {
                const worker = new Worker('./src/worker.js', {
                    workerData: { logFile, targetDate, start, end }
                });

                worker.on('message', (data) => {
                    logResults.push(...data);
                });

                worker.on('error', reject);

                worker.on('exit', () => {
                    completedWorkers++;
                    console.log(`Worker ${completedWorkers}/${NUM_WORKERS} completed.`);
                    resolve();
                });
            })
        );
    }

    await Promise.all(workers);

    const outputFile = path.join(outputDir, `output_${targetDate}.txt`);
    fs.writeFileSync(outputFile, logResults.join('\n'), 'utf-8');

    console.log(`\n Extracted ${logResults.length} logs for ${targetDate}. Saved to ${outputFile}`);
}

extractLogsParallel().catch(console.error);
