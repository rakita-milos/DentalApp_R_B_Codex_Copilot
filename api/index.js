const { app, initializeApp } = require('../backend/server');

module.exports = async (req, res) => {
  try {
    await initializeApp();
    return app(req, res);
  } catch (error) {
    console.error('Vercel API initialization failed:', error);
    return res.status(500).json({ error: 'API initialization failed' });
  }
};
