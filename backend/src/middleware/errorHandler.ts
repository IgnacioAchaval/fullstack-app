import { Request, Response, NextFunction } from 'express';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.statusCode,
        message: err.message
      }
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: {
      code: 500,
      message: 'Internal server error'
    }
  });
};

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
}; 