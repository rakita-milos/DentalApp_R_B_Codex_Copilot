const { app, initializeApp } = require('../backend/server');

// Vercel invokes this catch-all function for every /api/* request.  The
// initialization promise is shared by warm invocations and applies schema
// migrations plus the first-run demo accounts before Express handles a route.
module.exports = async (req, res) => {
  try {
    await initializeApp();
    return app(req, res);
  } catch (error) {
    console.error('Vercel API initialization failed:', error);
    return res.status(500).json({ error: 'API initialization failed' });
  }
};
