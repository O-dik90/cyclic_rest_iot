const distance = require('../../controller/sockets/distance');
const randomData = require('../../controller/sockets/randomTemp')

module.exports = function(io) {
  // Initialize WebSocket namespaces or routes
  randomData(io.of('/random-data-temp'))
  distance(io.of('/distance'))
};
