import AnalyticsEvent from '../models/AnalyticsEvent.js';
import PngPerformance from '../models/PngPerformance.js';
import Category from '../models/Category.js';

// GET /api/v1/analytics/overview (last 7 days traffic)
export const getOverview = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const events = await AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, eventType: { $in: ['view', 'download'] } } },
      { 
        $group: {
          _id: { 
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$eventType"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Format for frontend
    const dailyViews = Array(7).fill(0);
    const dailyDownloads = Array(7).fill(0);
    const dates = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    events.forEach(e => {
      const dateStr = e._id.date;
      const type = e._id.type;
      const index = dates.indexOf(dateStr);
      if (index !== -1) {
        if (type === 'view') dailyViews[index] = e.count;
        if (type === 'download') dailyDownloads[index] = e.count;
      }
    });

    res.json({ success: true, dailyViews, dailyDownloads, dates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/analytics/searches
export const getTopSearches = async (req, res) => {
  try {
    const searches = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'search', searchQuery: { $ne: '' } } },
      { $group: { _id: { $toLower: "$searchQuery" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, data: searches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/analytics/geo
export const getTopCountries = async (req, res) => {
  try {
    const geo = await AnalyticsEvent.aggregate([
      { $match: { country: { $ne: 'unknown' } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, data: geo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/analytics/sources
export const getTopSources = async (req, res) => {
  try {
    const sources = await AnalyticsEvent.aggregate([
      { $match: { referer: { $ne: '' } } },
      { $group: { _id: "$referer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, data: sources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/analytics/categories
export const getCategoryPerformance = async (req, res) => {
  try {
    const perf = await AnalyticsEvent.aggregate([
      { $match: { category: { $ne: null } } },
      { $group: { 
          _id: { category: "$category", type: "$eventType" }, 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    // We would populate the category names here
    await Category.populate(perf, { path: '_id.category', select: 'name slug' });

    res.json({ success: true, data: perf });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
