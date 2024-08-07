const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 20, // Время жизни записи в секундах
    },
  },
  { timestamps: true }
);

TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 20 });

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;
