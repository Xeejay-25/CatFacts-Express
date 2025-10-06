import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
    statusCode?: number;
    status?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`) as CustomError;
    error.statusCode = 404;
    next(error);
};

export const errorHandler = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = error.statusCode || error.status || 500;
    let message = error.message;

    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }

    if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // SQLite specific errors
    if (error.message.includes('UNIQUE constraint failed')) {
        statusCode = 409;
        message = 'Resource already exists';
    }

    if (error.message.includes('FOREIGN KEY constraint failed')) {
        statusCode = 400;
        message = 'Invalid reference';
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'production' ? null : error.stack,
        statusCode
    });
};