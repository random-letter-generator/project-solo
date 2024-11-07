const { GameResult } = require('../models/gomokuModels');

const gomokuController = {
  async saveGameResult(req, res) {
    try {
      const result = await GameResult.create(req.body);
      res.json(result);
    } catch (err) {
      console.error('Error saving game result:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getRecentGames(req, res) {
    try {
      const games = await GameResult.find().sort({ date: -1 }).limit(10);
      res.json(games);
    } catch (err) {
      console.error('Error fetching recent games:', err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = gomokuController;
