import { Router } from 'express';
import { body, query } from 'express-validator';
import {
    getRandomFact,
    getMultipleRandomFacts,
    searchFacts,
    getStatistics,
    populateFacts,
    getAllFacts
} from '../controllers/catFactController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/random', getRandomFact);

router.get('/random-multiple', [
    query('count').optional().isInt({ min: 1, max: 20 }).withMessage('Count must be between 1 and 20')
], getMultipleRandomFacts);

router.get('/search', [
    query('query').notEmpty().isLength({ min: 2, max: 100 }).withMessage('Query must be between 2 and 100 characters'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], searchFacts);

router.get('/statistics', getStatistics);

router.get('/', [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
    query('active').optional().isBoolean().withMessage('Active must be a boolean')
], getAllFacts);

// Protected routes for populating database
router.post('/populate', authenticateToken, [
    body('count').optional().isInt({ min: 1, max: 100 }).withMessage('Count must be between 1 and 100')
], populateFacts);

export default router;