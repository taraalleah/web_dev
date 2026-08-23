// getEndpoint1 callback
const getEndpoint1 = (req, res) => {
  res.send("I am endpoint get /endpoint1");
};

// getEndpoint2 callback
const getEndpoint2 = (req, res) => {
  res.send("I am endpoint get /endpoint2");
};

// getEndpoint3 callback 
const getEndpoint3 = (req, res) => {
  res.send("I am endpoint get /endpoint3");
};

// getRoot callback
const getRoot = (req, res) => {
  res.send("I am endpoint get /");
};

module.exports = {
  getEndpoint1,
  getEndpoint2,
  getEndpoint3,
  getRoot,
};