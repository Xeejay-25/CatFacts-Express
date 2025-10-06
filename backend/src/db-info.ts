import dotenv from 'dotenv';
import path from 'path';
import Database from './database/database';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function showDatabaseInfo() {
    console.log('📊 Database Information\n');
    console.log('='.repeat(50));

    const db = Database.getInstance();

    try {
        await db.connect();

        // Show connection info
        console.log('\n🔌 Connection:');
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   Port: ${process.env.DB_PORT}`);
        console.log(`   Database: ${process.env.DB_DATABASE}`);
        console.log(`   Username: ${process.env.DB_USERNAME}`);

        // Show tables
        console.log('\n📋 Tables:');
        const tables = await db.all('SHOW TABLES');
        tables.forEach((table: any) => {
            const tableName = Object.values(table)[0];
            console.log(`   ✓ ${tableName}`);
        });

        // Show counts
        console.log('\n📊 Record Counts:');
        const userCount = await db.get('SELECT COUNT(*) as count FROM users');
        const factCount = await db.get('SELECT COUNT(*) as count FROM cat_facts');
        const gameCount = await db.get('SELECT COUNT(*) as count FROM games');

        console.log(`   Users: ${userCount.count}`);
        console.log(`   Cat Facts: ${factCount.count}`);
        console.log(`   Games: ${gameCount.count}`);

        // Show sample cat facts
        console.log('\n🐱 Sample Cat Facts:');
        const facts = await db.all('SELECT id, LEFT(fact, 60) as fact FROM cat_facts LIMIT 5');
        facts.forEach((fact: any) => {
            console.log(`   ${fact.id}. ${fact.fact}...`);
        });

        console.log('\n' + '='.repeat(50));
        console.log('✅ Database check completed!\n');

        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

showDatabaseInfo();
