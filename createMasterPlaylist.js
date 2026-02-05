const { ListObjectsV2Command, PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

// Initialize the S3 client
const s3 = new S3Client({
  region: 'us-east-1',
});

// Function to create the HLS master playlist
async function createMasterPlaylist(bucket, videoId) {
  const listCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: `uploads/videos/review_videos/hls/${videoId}/`,
  });

  const listResponse = await s3.send(listCommand);
  console.log('Files in HLS folder:', listResponse.Contents?.map((obj) => obj.Key));

  // Filter for .m3u8 files
  const m3u8Files = listResponse.Contents?.filter((obj) => obj.Key?.endsWith('.m3u8')).map(
    (obj) => obj.Key?.split('/').pop()
  ) || [];

  console.log('M3U8 files found:', m3u8Files);

  // Find 360p and 720p files
  const file360p = m3u8Files.find((f) => f?.includes('360p'));
  const file720p = m3u8Files.find((f) => f?.includes('720p'));

  if (!file360p || !file720p) {
    throw new Error(`Could not find variant playlists. Found: ${m3u8Files.join(', ')}`);
  }

  // Create the master playlist content
  const masterPlaylist = `#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
${file360p}

#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
${file720p}
`;

  console.log('Creating master playlist with content:', masterPlaylist);

  // Upload the master playlist to S3
  const uploadCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: `uploads/videos/review_videos/hls/${videoId}/master.m3u8`,
    Body: masterPlaylist,
    ContentType: 'application/vnd.apple.mpegurl', 
  });

  await s3.send(uploadCommand);
  console.log('Master playlist created and uploaded successfully!');
}

module.exports = { createMasterPlaylist };
