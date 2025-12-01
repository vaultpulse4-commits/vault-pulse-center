// Test Database Connection to DomaiNesia PostgreSQL
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment from .env.domainesia (relative to project root)
const envPath = path.join(process.cwd(), '.env.domainesia');
console.log('Loading env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env.domainesia:', result.error.message);
  process.exit(1);
}

console.log('\n=== DOMAINESIA DATABASE CONNECTION TEST ===\n');

// Ensure we use the DATABASE_URL from .env.domainesia
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL not found in .env.domainesia');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: ['error', 'warn'],
});

async function testConnection() {
  try {
    console.log('📊 Testing database connection...');
    console.log(`Connection URL: ${process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')}\n`);

    // Test 1: Basic Connection
    console.log('Test 1: Basic Connection');
    await prisma.$connect();
    console.log('✓ Connected to database successfully!\n');

    // Test 2: Query Database
    console.log('Test 2: Query Database Version');
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✓ PostgreSQL Version:', result);
    console.log('');

    // Test 3: Check if tables exist
    console.log('Test 3: Check Tables');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    if (Array.isArray(tables) && tables.length > 0) {
      console.log(`✓ Found ${tables.length} tables:`);
      tables.forEach((table: any) => {
        console.log(`  - ${table.table_name}`);
      });
    } else {
      console.log('⚠ No tables found. Database is empty (migration needed).');
    }
    console.log('');

    // Test 4: Try to count users (if table exists)
    try {
      console.log('Test 4: Query User Table');
      const userCount = await prisma.user.count();
      console.log(`✓ Found ${userCount} users in database\n`);
    } catch (error: any) {
      console.log('⚠ User table not found (migration needed)\n');
    }

    console.log('=== CONNECTION TEST SUCCESSFUL ===');
    console.log('✓ Database is accessible');
    console.log('✓ Credentials are correct');
    console.log('✓ Ready for migration\n');

    console.log('Next steps:');
    console.log('1. Run migration: npx prisma migrate deploy');
    console.log('2. Or push schema: npx prisma db push');
    console.log('3. Seed database: npx prisma db seed\n');

  } catch (error: any) {
    console.error('\n=== CONNECTION TEST FAILED ===');
    console.error('✗ Error:', error.message);
    console.error('');
    
    if (error.message.includes('authentication failed')) {
      console.error('Possible causes:');
      console.error('- Wrong username or password');
      console.error('- User not granted permissions');
      console.error('- Check .env.domainesia file\n');
    } else if (error.message.includes('does not exist')) {
      console.error('Possible causes:');
      console.error('- Database not created yet');
      console.error('- Wrong database name');
      console.error('- Check cPanel PostgreSQL Databases\n');
    } else if (error.message.includes('connection')) {
      console.error('Possible causes:');
      console.error('- Wrong host or port');
      console.error('- PostgreSQL service not running');
      console.error('- Firewall blocking connection\n');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
