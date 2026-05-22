import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';

// Middleware
import errorHandler from './middleware/errorHandler.js';

// Route files
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import pngRoutes from './routes/pngs.js';
import submissionRoutes from './routes/submissions.js';
import searchRoutes from './routes/search.js';
import settingsRoutes from './routes/settings.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Headers (Configure helmet to allow cross-origin resource sharing of local files)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Enable CORS
app.use(
  cors({
    origin: '*', // For testing, allow any origin. In prod, configure to client url.
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Sanitize data to prevent NoSQL query injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use('/api/', limiter);

// Serve uploads static folder for local fallback storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/pngs', pngRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Error handler middleware
app.use(errorHandler);

export default app;
