import dotenv from 'dotenv';
import path from 'path';
import Database from './database/database';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function seedAdditionalData() {
    console.log('🌱 Starting additional data seeding...\n');

    const db = Database.getInstance();

    try {
        await db.connect();

        // Add more cat facts
        const additionalFacts = [
            "Cats can jump up to six times their length.",
            "A cat has 32 muscles in each ear.",
            "Cats spend 70% of their lives sleeping.",
            "A group of kittens is called a kindle.",
            "Cats have over 20 vocalizations, including the purr, meow, and hiss.",
            "The oldest known pet cat existed 9,500 years ago.",
            "Cats can run up to 30 mph.",
            "A cat's heart beats nearly twice as fast as a human heart.",
            "Cats have a third eyelid, which is rarely visible.",
            "Most cats are lactose intolerant and should not be given milk.",
            "A cat's brain is biologically more similar to a human brain than a dog's.",
            "Cats can rotate their ears 180 degrees.",
            "A cat's jaw cannot move sideways.",
            "Cats have five toes on their front paws, but only four on their back paws.",
            "A cat's purr may be a self-healing mechanism."
        ];

        console.log(`Adding ${additionalFacts.length} more cat facts...`);

        let added = 0;
        for (const fact of additionalFacts) {
            // Check if fact already exists
            const existing = await db.get(
                'SELECT id FROM cat_facts WHERE fact = ?',
                [fact]
            );

            if (!existing) {
                await db.run(
                    'INSERT INTO cat_facts (fact, length, is_active) VALUES (?, ?, ?)',
                    [fact, fact.length, 1]
                );
                added++;
            }
        }

        console.log(`✅ Added ${added} new cat facts`);

        // Add sample users
        console.log('\nAdding sample users...');
        const sampleUsers = [
            { name: 'Demo', email: 'demo@example.com' },
            { name: 'Player1', email: 'player1@example.com' },
            { name: 'TestUser', email: 'test@example.com' }
        ];

        let usersAdded = 0;
        for (const user of sampleUsers) {
            const existing = await db.get(
                'SELECT id FROM users WHERE email = ?',
                [user.email]
            );

            if (!existing) {
                await db.run(
                    'INSERT INTO users (name, email) VALUES (?, ?)',
                    [user.name, user.email]
                );
                usersAdded++;
            }
        }

        console.log(`✅ Added ${usersAdded} sample users`);

        // Show statistics
        const factCount = await db.get('SELECT COUNT(*) as count FROM cat_facts');
        const userCount = await db.get('SELECT COUNT(*) as count FROM users');

        console.log('\n📊 Database Statistics:');
        console.log(`   Cat Facts: ${factCount.count}`);
        console.log(`   Users: ${userCount.count}`);

        console.log('\n✅ Additional data seeding completed!\n');

        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedAdditionalData();
