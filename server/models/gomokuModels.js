const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://wfnwfnwfn:7Kp3gUGnOkpC7KL0@funan.z7fh4.mongodb.net/gomoku_games';

// Add more detailed connection error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  console.error('Full error details:', JSON.stringify(err, null, 2));
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Modify connection options
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'gomoku_games',
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
  } catch (err) {
    console.error('Initial MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

const gameResultSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  winner: {
    name: { type: String, required: true },
    id: { type: String, required: true },
  },
  loser: {
    name: { type: String, required: true },
    id: { type: String, required: true },
  },
  date: { type: Date, default: Date.now },
});

const GameResult = mongoose.model('GameResult', gameResultSchema);

module.exports = {
  GameResult,
  connection: mongoose.connection,
};
