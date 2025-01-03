const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://wfnwfnwfn:7Kp3gUGnOkpC7KL0@funan.z7fh4.mongodb.net/gomoku_games';

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  room: { type: String, default: 'general' },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = {
  Message,
  connection: mongoose.connection,
};
