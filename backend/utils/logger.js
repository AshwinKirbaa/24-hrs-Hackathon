import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

const formatMessage = (level, message, meta = '') => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? (typeof meta === 'object' ? JSON.stringify(meta) : meta) : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaString}\n`;
};

const writeLog = (filePath, content) => {
  fs.appendFile(filePath, content, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

export const logger = {
  info: (message, meta) => {
    const formatted = formatMessage('info', message, meta);
    if (process.env.NODE_ENV !== 'production') {
      process.stdout.write(formatted);
    }
    writeLog(combinedLogPath, formatted);
  },
  warn: (message, meta) => {
    const formatted = formatMessage('warn', message, meta);
    if (process.env.NODE_ENV !== 'production') {
      process.stdout.write(formatted);
    }
    writeLog(combinedLogPath, formatted);
  },
  error: (message, meta) => {
    const formatted = formatMessage('error', message, meta);
    process.stderr.write(formatted);
    writeLog(errorLogPath, formatted);
    writeLog(combinedLogPath, formatted);
  },
};
