import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import CatFactService from '../services/CatFactService';
import Database from '../database/database';

const catFactService = new CatFactService();
const db = Database.getInstance();

/**
 * Get a random cat fact (from database first, external API as fallback)
 */
export const getRandomFact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // First, try to get from database
        const fact = await catFactService.getRandomFact();

        if (fact) {
            return res.json({
                success: true,
                data: {
                    fact: fact.fact,
                    length: fact.length,
                    source: 'database'
                }
            });
        }

        // If no facts in database, fetch from external API
        const externalFact = await catFactService.getFromExternalAPI();

        return res.json({
            success: true,
            data: externalFact
        });
    } catch (error) {
        console.error('Error fetching cat fact:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch cat fact',
            data: {
                fact: 'Cats are amazing creatures! 🐱',
                source: 'fallback'
            }
        });
    }
};

/**
 * Get multiple random cat facts
 */
export const getMultipleRandomFacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const count = parseInt(req.query.count as string) || 5;

        const facts = await catFactService.getMultipleRandomFacts(count);

        if (facts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No cat facts available',
                data: []
            });
        }

        return res.json({
            success: true,
            data: {
                facts: facts.map(fact => ({
                    id: fact.id,
                    fact: fact.fact,
                    length: fact.length
                })),
                count: facts.length,
                source: 'database'
            }
        });
    } catch (error) {
        console.error('Error fetching multiple cat facts:', error);
        next(error);
    }
};

/**
 * Search cat facts
 */
export const searchFacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const query = req.query.query as string;
        const limit = parseInt(req.query.limit as string) || 10;

        const facts = await catFactService.searchFacts(query, limit);

        return res.json({
            success: true,
            data: {
                facts: facts.map(fact => ({
                    id: fact.id,
                    fact: fact.fact,
                    length: fact.length
                })),
                count: facts.length,
                query
            }
        });
    } catch (error) {
        console.error('Error searching cat facts:', error);
        next(error);
    }
};

/**
 * Get cat facts statistics
 */
export const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await catFactService.getStatistics();

        return res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        next(error);
    }
};

/**
 * Get all cat facts with pagination
 */
export const getAllFacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const limit = parseInt(req.query.limit as string) || 10;
        const page = parseInt(req.query.page as string) || 1;
        const activeOnly = req.query.active !== 'false'; // Default to true
        const offset = (page - 1) * limit;

        const whereClause = activeOnly ? 'WHERE is_active = 1' : '';

        const [facts, countResult] = await Promise.all([
            db.all(
                `SELECT id, fact, length, is_active, created_at FROM cat_facts ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
                [limit, offset]
            ),
            db.get(`SELECT COUNT(*) as total FROM cat_facts ${whereClause}`)
        ]);

        const total = countResult.total;
        const totalPages = Math.ceil(total / limit);

        return res.json({
            success: true,
            data: {
                facts,
                pagination: {
                    current_page: page,
                    per_page: limit,
                    total,
                    total_pages: totalPages,
                    has_next: page < totalPages,
                    has_prev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching all facts:', error);
        next(error);
    }
};

/**
 * Populate database with facts from external API (Protected)
 */
export const populateFacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const count = parseInt(req.body.count) || 50;

        console.log(`Starting to populate ${count} cat facts from external API...`);

        const result = await catFactService.populateFromExternalAPI(count);

        console.log('Population completed:', result);

        return res.json({
            success: true,
            message: `Successfully populated cat facts database`,
            data: result
        });
    } catch (error) {
        console.error('Error populating facts:', error);
        next(error);
    }
};