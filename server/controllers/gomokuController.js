const { GameResult } = require('../models/gomokuModels');

const gomokuController = {
  // Save game result
  async saveGameResult(req, res) {
    try {
      const { roomId, winner, loser } = req.body;
      const result = await GameResult.create({
        roomId,
        winner,
        loser,
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get recent games
  async getRecentGames(req, res) {
    try {
      const games = await GameResult.find().sort({ date: -1 }).limit(10);
      res.json(games);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = gomokuController;
