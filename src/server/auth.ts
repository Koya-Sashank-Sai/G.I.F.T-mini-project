import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getDb } from './db';
import { CustomerProfile, OfficerProfile, UserRole } from '../types';

export interface SessionData {
  sessionId: string;
  userId: string;
  username: string;
  role: UserRole;
  name: string;
  branch?: string;
  createdAt: number;
}

// In-memory active session store (backed by secure tokens)
const activeSessions = new Map<string, SessionData>();

export function createSession(userId: string, username: string, role: UserRole, name: string, branch?: string): string {
  const sessionId = crypto.randomBytes(32).toString('hex');
  activeSessions.set(sessionId, {
    sessionId,
    userId,
    username,
    role,
    name,
    branch,
    createdAt: Date.now()
  });
  return sessionId;
}

export function getSession(sessionId: string): SessionData | undefined {
  if (!sessionId) return undefined;
  const session = activeSessions.get(sessionId);
  if (!session) return undefined;
  // Session timeout: 24 hours
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    activeSessions.delete(sessionId);
    return undefined;
  }
  return session;
}

export function destroySession(sessionId: string): void {
  if (sessionId) {
    activeSessions.delete(sessionId);
  }
}

// Express Request augmentation
declare global {
  namespace Express {
    interface Request {
      userSession?: SessionData;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.gift_session) {
    token = req.cookies.gift_session;
  }

  if (token) {
    const session = getSession(token);
    if (session) {
      req.userSession = session;
    }
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.userSession) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }
  next();
}

export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userSession) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (req.userSession.role !== role) {
      res.status(403).json({ error: `Forbidden: requires ${role} role privileges` });
      return;
    }
    next();
  };
}
