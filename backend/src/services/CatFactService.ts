import axios from 'axios';
import NodeCache from 'node-cache';
import Database from '../database/database';
import { CatFact, CatFactApiResponse, CatFactStatistics, ApiResponse } from '../types';

class CatFactService {
    private cache: NodeCache;
    private readonly EXTERNAL_API_URL = process.env.CAT_FACTS_API_URL || 'https://catfact.ninja/fact';
    private readonly CACHE_DURATION = parseInt(process.env.CACHE_TTL || '300'); // 5 minutes
    private db: Database;

    constructor() {
        this.cache = new NodeCache({ stdTTL: this.CACHE_DURATION });
        this.db = Database.getInstance();
    }

    /**
     * Get a random cat fact with intelligent caching
     */
    async getRandomFact(): Promise<CatFact | null> {
        try {
            // Try to get from optimized cache pool
            let factPool = this.cache.get<CatFact[]>('random_fact_pool');

            if (!factPool) {
                const facts = await this.db.all(
                    'SELECT * FROM cat_facts WHERE is_active = 1 ORDER BY RANDOM() LIMIT 20'
                );

                if (facts.length > 0) {
                    factPool = facts;
                    this.cache.set('random_fact_pool', factPool, this.CACHE_DURATION);
                }
            }

            if (factPool && factPool.length > 0) {
                const randomIndex = Math.floor(Math.random() * factPool.length);
                return factPool[randomIndex];
            }

            return null;
        } catch (error) {
            console.error('Error getting random fact:', error);
            return null;
        }
    }

    /**
     * Get multiple unique random facts
     */
    async getMultipleRandomFacts(count: number): Promise<CatFact[]> {
        try {
            const facts = await this.db.all(
                'SELECT id, fact, length FROM cat_facts WHERE is_active = 1 ORDER BY RANDOM() LIMIT ?',
                [Math.min(count, 50)] // Cap at 50
            );
            return facts;
        } catch (error) {
            console.error('Error getting multiple random facts:', error);
            return [];
        }
    }

    /**
     * Search facts with caching
     */
    async searchFacts(query: string, limit: number = 10): Promise<CatFact[]> {
        try {
            const cacheKey = `search_facts_${Buffer.from(query).toString('base64')}_${limit}`;
            let results = this.cache.get<CatFact[]>(cacheKey);

            if (!results) {
                results = await this.db.all(
                    'SELECT id, fact, length FROM cat_facts WHERE is_active = 1 AND fact LIKE ? ORDER BY length LIMIT ?',
                    [`%${query}%`, Math.min(limit, 50)]
                );
                this.cache.set(cacheKey, results, this.CACHE_DURATION);
            }

            return results;
        } catch (error) {
            console.error('Error searching facts:', error);
            return [];
        }
    }

    /**
     * Populate database with facts from external API
     */
    async populateFromExternalAPI(count: number = 50): Promise<{
        imported: number;
        duplicates: number;
        errors: number;
        total_requested: number;
        success_rate: number;
    }> {
        let imported = 0;
        let duplicates = 0;
        let errors = 0;
        const maxErrors = Math.min(5, Math.ceil(count * 0.1)); // Allow up to 10% errors

        try {
            for (let i = 0; i < count && errors < maxErrors; i++) {
                try {
                    const response = await axios.get<CatFactApiResponse>(this.EXTERNAL_API_URL, {
                        timeout: 10000
                    });

                    if (response.status === 200 && response.data.fact) {
                        const saved = await this.saveCatFact({
                            fact: response.data.fact,
                            length: response.data.length || response.data.fact.length
                        });

                        if (saved) {
                            imported++;
                        } else {
                            duplicates++;
                        }
                    } else {
                        errors++;
                    }

                    // Respectful delay
                    if (i < count - 1) {
                        await new Promise(resolve => setTimeout(resolve, 100)); // 0.1 second
                    }
                } catch (error) {
                    errors++;
                    console.error(`Error fetching cat fact (attempt ${i + 1}):`, error);
                }
            }

            // Clear caches after successful import
            this.clearFactCaches();

            return {
                imported,
                duplicates,
                errors,
                total_requested: count,
                success_rate: Math.round((((imported + duplicates) / count) * 100) * 100) / 100
            };
        } catch (error) {
            console.error('Failed to populate cat facts:', error);
            throw error;
        }
    }

    /**
     * Get comprehensive statistics about cat facts
     */
    async getStatistics(): Promise<CatFactStatistics> {
        try {
            const cacheKey = 'cat_facts_detailed_stats';
            let stats = this.cache.get<CatFactStatistics>(cacheKey);

            if (!stats) {
                const [mainStats, lengthDistribution] = await Promise.all([
                    this.db.get(`
            SELECT 
              COUNT(*) as total_facts,
              SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_facts,
              SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_facts,
              AVG(CASE WHEN is_active = 1 THEN length END) as avg_length,
              MIN(CASE WHEN is_active = 1 THEN length END) as min_length,
              MAX(CASE WHEN is_active = 1 THEN length END) as max_length
            FROM cat_facts
          `),
                    this.db.all(`
            SELECT 
              CASE 
                WHEN length < 50 THEN 'short'
                WHEN length < 150 THEN 'medium'
                ELSE 'long'
              END as length_category,
              COUNT(*) as count
            FROM cat_facts 
            WHERE is_active = 1
            GROUP BY length_category
          `)
                ]);

                const distribution: { [key: string]: number } = {};
                lengthDistribution.forEach((row: any) => {
                    distribution[row.length_category] = row.count;
                });

                stats = {
                    total_facts: mainStats.total_facts || 0,
                    active_facts: mainStats.active_facts || 0,
                    inactive_facts: mainStats.inactive_facts || 0,
                    average_length: Math.round((mainStats.avg_length || 0) * 100) / 100,
                    shortest_length: mainStats.min_length || 0,
                    longest_length: mainStats.max_length || 0,
                    length_distribution: {
                        short: distribution.short || 0,
                        medium: distribution.medium || 0,
                        long: distribution.long || 0
                    }
                };

                this.cache.set(cacheKey, stats, 3600); // Cache for 1 hour
            }

            return stats;
        } catch (error) {
            console.error('Error getting statistics:', error);
            throw error;
        }
    }

    /**
     * Get a fact from external API with fallback
     */
    async getFromExternalAPI(): Promise<{
        fact: string;
        length: number;
        source: string;
    }> {
        try {
            const response = await axios.get<CatFactApiResponse>(this.EXTERNAL_API_URL, {
                timeout: 10000
            });

            if (response.status === 200 && response.data.fact) {
                const factData = {
                    fact: response.data.fact,
                    length: response.data.length || response.data.fact.length
                };

                // Try to save to database
                await this.saveCatFact(factData);

                return {
                    ...factData,
                    source: 'external_api'
                };
            }

            throw new Error('External API request failed');
        } catch (error) {
            console.error('External API error:', error);

            return {
                fact: 'Cats have been domesticated for over 4,000 years! 🐱',
                length: 56,
                source: 'fallback'
            };
        }
    }

    /**
     * Save a cat fact to the database (avoiding duplicates)
     */
    private async saveCatFact(data: { fact: string; length: number }): Promise<boolean> {
        try {
            const fact = data.fact.trim();

            if (!fact) {
                return false;
            }

            // Check if fact already exists
            const existing = await this.db.get(
                'SELECT id FROM cat_facts WHERE fact = ?',
                [fact]
            );

            if (!existing) {
                await this.db.run(
                    'INSERT INTO cat_facts (fact, length, is_active) VALUES (?, ?, ?)',
                    [fact, data.length, 1]
                );
                return true;
            }

            return false; // Duplicate
        } catch (error) {
            console.error('Error saving cat fact:', error);
            return false;
        }
    }

    /**
     * Clear all fact-related caches
     */
    clearFactCaches(): void {
        const cacheKeys = [
            'random_fact_pool',
            'cat_facts_detailed_stats'
        ];

        cacheKeys.forEach(key => {
            this.cache.del(key);
        });

        // Clear search caches (simplified approach)
        this.cache.flushAll();
    }

    /**
     * Batch update facts (useful for admin operations)
     */
    async batchUpdateFactStatus(factIds: number[], isActive: boolean): Promise<number> {
        try {
            const placeholders = factIds.map(() => '?').join(',');
            const result = await this.db.run(
                `UPDATE cat_facts SET is_active = ? WHERE id IN (${placeholders})`,
                [isActive ? 1 : 0, ...factIds]
            );

            if (result.changes && result.changes > 0) {
                this.clearFactCaches();
            }

            return result.changes || 0;
        } catch (error) {
            console.error('Error batch updating facts:', error);
            return 0;
        }
    }
}

export default CatFactService;