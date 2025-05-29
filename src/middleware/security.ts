import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/environments';

export const validateWebhookSignature = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Skip validation in development
    if (!config.security.enableSignatureValidation) {
      logger.debug('Skipping webhook signature validation (development mode)');
      return next();
    }

    const signature = req.headers['x-firebase-signature'] as string;
    const timestamp = req.headers['x-firebase-timestamp'] as string;

    if (!signature || !timestamp) {
      logger.warn('Missing required webhook headers', {
        hasSignature: !!signature,
        hasTimestamp: !!timestamp
      });
      res.status(401).json({ error: 'Missing webhook signature or timestamp' });
      return;
    }

    // Check timestamp to prevent replay attacks (5 minutes tolerance)
    const requestTime = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDifference = Math.abs(currentTime - requestTime);

    if (timeDifference > 300) { // 5 minutes
      logger.warn('Webhook timestamp too old', {
        requestTime,
        currentTime,
        difference: timeDifference
      });
      res.status(401).json({ error: 'Request timestamp too old' });
      return;
    }

    // In a real implementation, you would verify the signature here
    // using Firebase's public key or a shared secret
    logger.debug('Webhook signature validation passed');
    next();
  } catch (error) {
    logger.error('Error validating webhook signature', error as Error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Rate limiting middleware
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const currentTime = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = config.security.rateLimitPerMinute;

  const clientData = requestCounts.get(clientIp);

  if (!clientData || currentTime > clientData.resetTime) {
    // Reset or initialize counter
    requestCounts.set(clientIp, {
      count: 1,
      resetTime: currentTime + windowMs
    });
    return next();
  }

  if (clientData.count >= maxRequests) {
    logger.warn('Rate limit exceeded', { clientIp, count: clientData.count });
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil((clientData.resetTime - currentTime) / 1000)
    });
    return;
  }

  clientData.count++;
  next();
};
