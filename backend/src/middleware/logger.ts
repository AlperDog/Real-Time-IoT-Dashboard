import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  userAgent: string;
  ip: string;
  userId?: string;
  message?: string;
  error?: string;
}

class Logger {
  private logDir: string;
  private logFile: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'app.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeLog(entry: LogEntry): void {
    const logLine = JSON.stringify(entry) + '\n';
    
    fs.appendFile(this.logFile, logLine, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      const color = entry.statusCode >= 400 ? '\x1b[31m' : 
                   entry.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
      console.log(`${color}${entry.method} ${entry.url} ${entry.statusCode} ${entry.responseTime}ms\x1b[0m`);
    }
  }

  log(level: LogEntry['level'], message: string, meta?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      method: '',
      url: '',
      statusCode: 0,
      responseTime: 0,
      userAgent: '',
      ip: '',
      message,
      ...meta
    };

    this.writeLog(entry);
  }

  info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: any): void {
    this.log('error', message, meta);
  }
}

const logger = new Logger();

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const { method, url, headers } = req;
  const userAgent = headers['user-agent'] || '';
  const ip = req.ip || req.connection.remoteAddress || '';

  // Override res.end to capture response data
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const responseTime = Date.now() - start;
    const { statusCode } = res;
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: statusCode >= 400 ? 'error' : 'info',
      method,
      url,
      statusCode,
      responseTime,
      userAgent,
      ip,
      userId: (req as any).user?.userId
    };

    logger.writeLog(logEntry);
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  const { method, url, headers } = req;
  const userAgent = headers['user-agent'] || '';
  const ip = req.ip || req.connection.remoteAddress || '';

  logger.error('Unhandled error', {
    method,
    url,
    userAgent,
    ip,
    userId: (req as any).user?.userId,
    error: error.message,
    stack: error.stack
  });

  next(error);
};

export default logger; 