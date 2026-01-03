import { Request, Response } from 'express';
import { RateService } from '../services/rateService';

export const getRates = async (req: Request, res: Response) => {
    try {
        const { base } = req.query;
        const rates = await RateService.getRates(base as string || 'USD');
        res.json(rates);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch rates' });
    }
};

export const getCurrencies = async (req: Request, res: Response) => {
    try {
        const list = await RateService.getCurrencies();
        res.json(list);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch currencies' });
    }
};

export const convertCurrency = async (req: Request, res: Response) => {
    try {
        const { from, to, amount } = req.query;
        const result = await RateService.convert(Number(amount), from as string, to as string);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: 'Conversion failed' });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        const { start_date, end_date, base } = req.query;
        const history = await RateService.getHistory(start_date as string, end_date as string, base as string);
        res.json(history);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};


