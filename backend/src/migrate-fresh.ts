import dotenv from 'dotenv';
import path from 'path';
import Database, { createTables, createIndexes, seedData } from './database/database';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function dropAllTables() {
    console.log('🗑️  Dropping all tables...');

    const db = Database.getInstance();

    try {
        // Disable foreign key checks to allow dropping tables with foreign keys
        await db.exec('SET FOREIGN_KEY_CHECKS = 0');

        // Drop tables in reverse order of dependencies
        await db.exec('DROP TABLE IF EXISTS games');
        await db.exec('DROP TABLE IF EXISTS cat_facts');
        await db.exec('DROP TABLE IF EXISTS users');

        // Re-enable foreign key checks
        await db.exec('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✅ All tables dropped successfully');
    } catch (error) {
        console.error('❌ Error dropping tables:', error);
        throw error;
    }
}

async function migrateFresh() {
    console.log('🚀 Starting fresh migration...\n');

    const db = Database.getInstance();

    try {
        // Connect to database
        await db.connect();

        // Drop all existing tables
        await dropAllTables();

        console.log('\n📋 Creating tables...');
        await createTables();

        console.log('\n📊 Creating indexes...');
        await createIndexes();

        console.log('\n🌱 Seeding data...');
        await seedData();

        console.log('\n✅ Fresh migration completed successfully!\n');

        // Close connection
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateFresh();
