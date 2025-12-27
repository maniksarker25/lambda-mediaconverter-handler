const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    receiver: { type: String, required: true },
    title: String,
    type: String,
    message: String,
    data: {
      reviewId: { type: Schema.Types.ObjectId, ref: "Review" }
    },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
