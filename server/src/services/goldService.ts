import prisma from '../utils/prismaClient';
import axios from 'axios';

const METAL_API_URL = 'https://api.metalpriceapi.com/v1/latest';
const API_KEY = '3b7cc43274f8fc75faa69bcac746bfd9'; // In production, use env var
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

export class GoldService {
    static async getRates(base: string = 'USD') {
        // 1. Check Cache (Latest entry in DB)
        const latestRate = await prisma.goldRate.findFirst({
            where: { base },
            orderBy: { timestamp: 'desc' },
        });

        if (latestRate) {
            const age = Date.now() - latestRate.timestamp.getTime();
            if (age < CACHE_DURATION_MS) {
                console.log('Serving Gold Rates from Cache');
                return {
                    rates: JSON.parse(latestRate.rates),
                    timestamp: latestRate.timestamp
                };
            }
        }

        // 2. Fetch from API if cache miss or stale
        console.log('Fetching Gold Rates from API...');
        try {
            const response = await axios.get(METAL_API_URL, {
                params: {
                    api_key: API_KEY,
                    base: base,
                    currencies: 'EUR,XAU,XAG,USD'
                }
            });

            if (response.data && response.data.rates) {
                const rates = response.data.rates;

                // 3. Store in DB
                await prisma.goldRate.create({
                    data: {
                        base,
                        rates: JSON.stringify(rates),
                    }
                });

                return {
                    rates: rates,
                    timestamp: new Date()
                };
            } else {
                throw new Error('Invalid response from MetalpriceAPI');
            }
        } catch (error) {
            console.error('Error fetching gold rates:', error);
            // Fallback to cache if available even if stale
            if (latestRate) {
                console.log('Serving STALE Gold Rates from Cache due to API error');
                return {
                    rates: JSON.parse(latestRate.rates),
                    timestamp: latestRate.timestamp
                };
            }
            throw error;
        }
    }

}
