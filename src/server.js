import app from './app.js';
import { PORT } from './config/appConfig.config.js';

app
  .listen(PORT, () => {
    console.log(`Server Start at port:${PORT}`);
  })
  .on('error', (err) => {
    console.log(`Server failed: ${err}`);
  });
