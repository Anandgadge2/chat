export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
}

const logs: LogEntry[] = [];

function formatLog(entry: LogEntry): string {
  const timeStr = entry.timestamp.toISOString();
  const levelStr = entry.level.toUpperCase().padEnd(6);
  const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
  return `[${timeStr}] ${levelStr} ${entry.message}${dataStr}`;
}

export function log(level: LogLevel, message: string, data?: unknown): void {
  const entry: LogEntry = {
    timestamp: new Date(),
    level,
    message,
    data,
  };

  logs.push(entry);

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    const formatted = formatLog(entry);
    switch (level) {
      case 'info':
        console.log(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
      case 'debug':
        console.debug(formatted);
        break;
    }
  }
}

export function logInfo(message: string, data?: unknown): void {
  log('info', message, data);
}

export function logWarn(message: string, data?: unknown): void {
  log('warn', message, data);
}

export function logError(message: string, data?: unknown): void {
  log('error', message, data);
}

export function logDebug(message: string, data?: unknown): void {
  log('debug', message, data);
}

export function getLogs(): LogEntry[] {
  return logs.slice();
}

export function clearLogs(): void {
  logs.length = 0;
}

export function getRecentLogs(count: number = 100): LogEntry[] {
  return logs.slice(-count);
}
