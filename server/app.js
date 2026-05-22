import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

// Middleware
import errorHandler from './middleware/errorHandler.js';

// Route files
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import pngRoutes from './routes/pngs.js';
import submissionRoutes from './routes/submissions.js';
import searchRoutes from './routes/search.js';

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

// Serve uploads static folder for local fallback storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/pngs', pngRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/search', searchRoutes);

// Error handler middleware
app.use(errorHandler);

export default app;
