import { Router } from 'express';
import { getCurrencies, getRates, convertCurrency, getHistory } from '../controllers/rateController';
import * as rateController from '../controllers/rateController';

const router = Router();

router.get('/currencies', rateController.getCurrencies);
router.get('/rates', rateController.getRates);
router.get('/convert', rateController.convertCurrency);
router.get('/history', rateController.getHistory);

export default router;
