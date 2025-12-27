const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const ReviewSchema = new Schema(
  {
    reviewer: { type: Types.ObjectId, ref: "Reviewer", required: true },
    product: { type: Types.ObjectId, ref: "Product", required: true },
    business: { type: Types.ObjectId, ref: "Bussiness", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    campaign: { type: Types.ObjectId, ref: "Campaign", required: true },
    amount: Number,
    description: String,
    images: [String],
    video: String,
    thumbnail: String,
    rating: Number,
    videoId: String,
    isReady: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
