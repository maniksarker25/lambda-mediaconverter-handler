const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

async function connectDB(uri) {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(uri);
  return cached.conn;
}

module.exports = connectDB;
