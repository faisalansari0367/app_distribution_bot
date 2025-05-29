interface LogContext {
  [key: string]: any;
}

class Logger {
  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    console.debug(this.formatMessage('debug', message, context));
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | LogContext, context?: LogContext): void {
    let errorContext = context || {};

    if (error instanceof Error) {
      errorContext = {
        ...errorContext,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        }
      };
    } else if (error && typeof error === 'object') {
      errorContext = { ...errorContext, ...error };
    }

    console.error(this.formatMessage('error', message, errorContext));
  }
}

export const logger = new Logger();
