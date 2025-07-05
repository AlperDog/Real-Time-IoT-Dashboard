import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Authentication middleware tarafından eklenen user bilgisi
    }
  }
}

export {}; 