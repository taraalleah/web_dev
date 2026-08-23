// const express = require('express');
// const app = express();
// const port = 3001;

// // Callback function for the root endpoint
// const handleRootRequest = (req, res) => {
//   res.send('Hello World!');
// };

// // Callback function for when the server starts listening
// const handleServerListening = () => {
//   console.log(`Example app listening on port ${port}`);
// };

// // Registering routes with the callback functions
// app.get('/', handleRootRequest);

// // Starting the server and listening on the specified port
// app.listen(port, handleServerListening);

const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});