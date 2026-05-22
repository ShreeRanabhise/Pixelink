import express from 'express';
const router = express.Router();
import { getOverview, getTopSearches, getTopCountries, getTopSources, getCategoryPerformance } from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

router.use(protect);
router.use(adminOnly);

router.get('/overview', getOverview);
router.get('/searches', getTopSearches);
router.get('/geo', getTopCountries);
router.get('/sources', getTopSources);
router.get('/categories', getCategoryPerformance);

export default router;
