const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 5000;

const server = app.listen(port, (err) => {
  if (err) {
    console.log(`App is not running on port ${port}`);
  }
  console.log(`App is listening on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
