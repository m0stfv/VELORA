/**
 * Server Entry Point
 * Starts the HTTP server and connects to MongoDB
 */

// Load environment variables
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the local server.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`VELORA API server is running on http://localhost:${PORT}`);
  });
}).catch(() => {
  process.exit(1);
});
