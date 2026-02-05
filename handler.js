// handler.js
const connectDB = require('./db');
const Review = require('./models/Review');
const Notification = require('./models/Notification');
const { createMasterPlaylist } = require('./createMasterPlaylist');

exports.handler = async (event) => {
  console.log("Received Event:", JSON.stringify(event));

  const { status, jobId, userMetadata } = event.detail;
  const { reviewId, reviewerId } = userMetadata || {};

  if (!reviewId || !reviewerId) {
    console.error('Missing reviewId or reviewerId in event');
    return;
  }

  await connectDB(process.env.MONGO_URI);

  if (status === 'COMPLETE') {
    // Update Review status to 'Ready'
    await Review.findByIdAndUpdate(reviewId, { isReady: true });

    // Generate and upload the master playlist for the HLS stream
    try {
      await createMasterPlaylist('sampli-application', userMetadata.videoId);  // Call createMasterPlaylist
    } catch (error) {
      console.error('Error generating master playlist:', error);
    }

    // Send success notification to the reviewer
    await Notification.create({
      receiver: reviewerId,
      title: 'Video Ready',
      type: 'review',
      message: 'Your review video has been processed successfully.',
      data: { reviewId },
    });
  }

  if (status === 'ERROR') {
    // Update Review status to 'Failed'
    await Review.findByIdAndUpdate(reviewId, { isReady: false });

    // Send failure notification to the reviewer
    await Notification.create({
      receiver: reviewerId,
      title: 'Video Failed',
      type: 'review',
      message: 'Your review video failed to process. Please upload again.',
      data: { reviewId },
    });
  }

  return { success: true };
};
