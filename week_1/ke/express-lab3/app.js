const express = require("express");
const app = express();
const port = 3001;

// Import callbacks
const { getEndpoint1, getEndpoint2, getEndpoint3, getRoot } = require("./controllers");

// Define routes
app.get("/", getRoot);
app.get("/endpoint1", getEndpoint1);
app.get("/endpoint2", getEndpoint2);
app.get("/endpoint3", getEndpoint3);

// Start the server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});