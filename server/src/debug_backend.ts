import prisma from './utils/prismaClient';
import axios from 'axios';

async function test() {
    console.log('--- Testing Database Connection ---');
    try {
        const count = await prisma.rate.count();
        console.log('Database connected. Rate count:', count);
    } catch (e) {
        console.error('Database connection failed:', e);
    }

    console.log('\n--- Testing External API ---');
    try {
        const res = await axios.get('https://api.frankfurter.app/latest?from=USD');
        console.log('API fetch success. Base:', res.data.base);
    } catch (e) {
        console.error('API fetch failed:', e);
    }
}

test().finally(() => prisma.$disconnect());
