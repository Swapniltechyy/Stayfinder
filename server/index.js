const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');

// GET /api/cities - returns list of available city names
app.get('/api/cities', (req, res) => {
  try {
    const indexPath = path.join(dataDir, 'index.json');
    if (!fs.existsSync(indexPath)) {
      return res.status(404).json({ error: 'index.json not found' });
    }
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    return res.json(indexData);
  } catch (err) {
    console.error('Error reading cities list:', err);
    return res.status(500).json({ error: 'Failed to read cities list' });
  }
});

// GET /api/cities/:cityName - returns full JSON object for that city
app.get('/api/cities/:cityName', (req, res) => {
  try {
    const requestedCity = req.params.cityName.toLowerCase();
    
    // Read all files in dataDir to perform a case-insensitive match
    const files = fs.readdirSync(dataDir);
    const matchedFile = files.find(file => {
      const baseName = path.parse(file).name.toLowerCase();
      return baseName === requestedCity && file.endsWith('.json');
    });

    if (!matchedFile) {
      return res.status(404).json({ error: `City '${req.params.cityName}' not found` });
    }

    const filePath = path.join(dataDir, matchedFile);
    const cityData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return res.json(cityData);
  } catch (err) {
    console.error(`Error reading city data for ${req.params.cityName}:`, err);
    return res.status(500).json({ error: 'Failed to read city data' });
  }
});

// Static require ensures Vercel's bundler packages data files into serverless function
try {
  require('./data/index.json');
  require('./data/darjeeling.json');
  require('./data/sikkim.json');
} catch (e) {}

// Serve client in production if built and not on Vercel
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (!process.env.VERCEL && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`StayFinder API server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
