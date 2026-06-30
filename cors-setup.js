const { initializeApp } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

initializeApp({
  projectId: 'civentra-ai'
});

const bucket = getStorage().bucket('civentra-ai.appspot.com');

const corsConfiguration = [
  {
    origin: ['https://civentra-ai.vercel.app', 'https://civentra-ai.web.app', '*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
    maxAgeSeconds: 3600
  }
];

bucket.setCorsConfiguration(corsConfiguration)
  .then(() => {
    console.log('Successfully set CORS configuration for bucket');
  })
  .catch((error) => {
    console.error('Error setting CORS configuration:', error);
  });
