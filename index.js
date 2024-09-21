require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoute')
const tableRouter = require('./routes/tableRoute')
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet')
const { createServer } = require("http")
const { Server } = require('socket.io')
const cookieParser = require('cookie-parser');
const websocketRoutes = require('./routes/sockets');
const app = express();

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      // useNewUrlParser: true,
      // useUnifieldTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

app.set("view engine", "ejs");

//** Middleware */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//** initializing*/
app.all('/', (req, res) => {
  res.json({ "message": "Welcome to Rest API" })
  console.log('Cookies: ', req.cookies);
})

//** routing */
app.use('/api/auth', authRouter);
app.use('/api', tableRouter);

//** global error handler */
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

//** web-socket */
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {
  console.log("web-socket mode on!");
  console.log(`user connected : ${socket.id}`);

  socket.on('message', async (data) => {
    try {
      io.emit('msg', data);
    } catch (error) {
      handleSocketError(socket, error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

websocketRoutes(io);

function handleSocketError(socket, error) {
  console.error('Socket Error:', error.message);
  socket.emit('error', { message: error.message || 'Internal Server Error' });
}

//Connect to the database before listening
connectDB().then(() => {
  httpServer.listen(process.env.PORT, () => {
    console.log("listening for requests");
    console.log(`Server listening on localhost:${process.env.PORT} ...`)
  })
})
