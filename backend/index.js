const port = 4000;
const path = require('path');
const express = require('express');

const webServer = express();

// serve the built dist of our React application
webServer.use(express.static(path.join(__dirname, '../', 'dist')));

// test route
webServer.get('/api/hejsan', (req, res) => {
  res.json({ message: 'Hejsan' });
})

webServer.listen(port, () =>
  console.log('Backend listening on http://localhost:' + port));
