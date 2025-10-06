import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import Database from '../database/database';
import { User } from '../types';

const router = Router();

// Get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const db = Database.getInstance();
        const users = await db.all(
            'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
});

// Get user by ID
router.get('/:id',
    param('id').isInt().withMessage('User ID must be an integer'),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID',
                details: errors.array()
            });
        }

        try {
            const db = Database.getInstance();
            const userId = parseInt(req.params.id);

            const user = await db.get(
                'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
                [userId]
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user'
            });
        }
    }
);

// Create new user
router.post('/',
    [
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
        body('email')
            .optional({ nullable: true, checkFalsy: true })
            .trim()
            .isEmail().withMessage('Invalid email format')
            .normalizeEmail(),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        try {
            const db = Database.getInstance();
            const { name, email } = req.body;

            // Check if email already exists (if email provided)
            if (email) {
                const existingUser = await db.get(
                    'SELECT id FROM users WHERE email = ?',
                    [email]
                );

                if (existingUser) {
                    return res.status(409).json({
                        success: false,
                        error: 'Email already registered'
                    });
                }
            }

            // Insert new user
            const result = await db.run(
                'INSERT INTO users (name, email) VALUES (?, ?)',
                [name, email || null]
            );

            // Fetch the created user
            const newUser = await db.get(
                'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json({
                success: true,
                data: newUser,
                message: 'User created successfully'
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create user'
            });
        }
    }
);

// Get user statistics
router.get('/stats/:id',
    param('id').isInt().withMessage('User ID must be an integer'),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID',
                details: errors.array()
            });
        }

        try {
            const db = Database.getInstance();
            const userId = parseInt(req.params.id);

            // Get user
            const user = await db.get(
                'SELECT id, name FROM users WHERE id = ?',
                [userId]
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Get user statistics
            const stats = await db.get(`
                SELECT 
                    COUNT(*) as total_games,
                    SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as won_games,
                    SUM(CASE WHEN status = 'abandoned' THEN 1 ELSE 0 END) as abandoned_games,
                    AVG(CASE WHEN status = 'won' THEN score ELSE NULL END) as avg_score,
                    MAX(score) as best_score,
                    AVG(CASE WHEN status = 'won' THEN time_elapsed ELSE NULL END) as avg_time,
                    MIN(CASE WHEN status = 'won' THEN time_elapsed ELSE NULL END) as best_time
                FROM games
                WHERE user_id = ?
            `, [userId]);

            res.json({
                success: true,
                data: {
                    user,
                    statistics: stats
                }
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user statistics'
            });
        }
    }
);

export default router;