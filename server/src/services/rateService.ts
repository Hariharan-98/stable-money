import axios from 'axios';
import prisma from '../utils/prismaClient';

const API_URL = 'https://api.frankfurter.app';

export class RateService {
    static async getRates(base: string = 'USD') {
        // Check if we have recent rates (e.g., within last 1 hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        // Check for cached rates
        // This is a simplification. We might want to check if we have ALL rates for this base.
        // For now, we check if we have any rate for this base recently.
        const cached = await prisma.rate.findFirst({
            where: {
                base: base,
                timestamp: { gt: oneHourAgo }
            }
        });

        if (cached) {
            console.log(`Cache HIT for ${base}`);
            const allRates = await prisma.rate.findMany({
                where: { base: base, timestamp: { gt: oneHourAgo } },
                include: { targetCurrency: true }
            });
            // Format to mimic API response or standard format
            const ratesMap: Record<string, number> = {};
            allRates.forEach(r => ratesMap[r.target] = r.rate);
            return { base, date: allRates[0].timestamp.toISOString().split('T')[0], rates: ratesMap };
        }

        console.log(`Cache MISS for ${base}. Fetching from API...`);
        // Fetch from API
        try {
            const response = await axios.get(`${API_URL}/latest?from=${base}`);
            const data = response.data;
            console.log(`API Response for ${base}:`, JSON.stringify(data.rates).substring(0, 100) + '...');

            // Cache currencies and rates
            await this.cacheRates(base, data.rates, data.date);

            return data;
        } catch (error) {
            console.error("Error fetching rates", error);
            throw new Error("Failed to fetch rates");
        }
    }

    static async cacheRates(base: string, rates: Record<string, number>, dateStr: string) {
        const timestamp = new Date(); // Use current time for cache expiry check

        // Ensure base currency exists
        await prisma.currency.upsert({
            where: { code: base },
            update: {},
            create: { code: base, name: base } // Name might be updated later if we have a list of names
        });

        const ratesData = Object.entries(rates).map(([target, rate]) => ({
            base,
            target,
            rate,
            timestamp
        }));

        // Ensure target currencies exist and save rates
        for (const r of ratesData) {
            await prisma.currency.upsert({
                where: { code: r.target },
                update: {},
                create: { code: r.target, name: r.target }
            });

            // We can create a new rate entry. 
            // Note: unique constraint on [base, target, timestamp] might need management if we want latest.
            // For now, just creating a new record is fine, but we might accumulate data.
            await prisma.rate.create({
                data: {
                    base: r.base,
                    target: r.target,
                    rate: r.rate,
                    timestamp: timestamp
                }
            });
        }
    }

    static async convert(amount: number, from: string, to: string) {
        if (from === to) return amount;

        // Get rates for 'from'
        const rates = await this.getRates(from);
        const rate = rates.rates[to];

        if (!rate) throw new Error(`Rate not found for ${from} to ${to}`);

        return amount * rate;
    }

    static async getHistory(start: string, end: string, base: string = 'USD') {
        // Frankfurter supports history: /start..end?from=...
        const response = await axios.get(`${API_URL}/${start}..${end}?from=${base}`);
        return response.data;
    }

    static async getCurrencies() {
        // Fetch available currencies from Frankfurter or DB
        // Frankfurter: /currencies
        const response = await axios.get(`${API_URL}/currencies`);
        return response.data;
    }
}
