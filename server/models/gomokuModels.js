const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://wfnwfnwfn:7Kp3gUGnOkpC7KL0@funan.z7fh4.mongodb.net/?retryWrites=true&w=majority&appName=funan';

mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'gomoku_games', // Changed database name
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

const gameResultSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  winner: {
    name: { type: String, required: true },
    id: { type: String, required: true }
  },
  loser: {
    name: { type: String, required: true },
    id: { type: String, required: true }
  },
  date: { type: Date, default: Date.now }
});

const GameResult = mongoose.model('GameResult', gameResultSchema);

module.exports = {
  GameResult
};
