const distance = (socket) => {
  socket.on('connection', socket => {
    console.log("Connect to Distance")
  })
}

module.exports = distance