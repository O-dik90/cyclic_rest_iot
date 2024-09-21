
const randomTemp = (socket) => {
  socket.on("connection", (socket) => {  
    let num = 0;
    
    const intervalId = setInterval(() => {
      num++;
      const genTemp = ((Math.random() * (27.9 - 22.1) + 22.1).toFixed(2)); // Random data to send
      socket.emit('update', { name: `n${num}`, data: genTemp }); // Emit event 'update' ke klien
      
      console.log(`Data Temp ${num} : ${genTemp} to client: ${socket.id}`);
    }, 5000);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      clearInterval(intervalId); // Hentikan interval ketika klien terputus
    });
  })
}

module.exports = randomTemp