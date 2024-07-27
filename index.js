require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session)
const authRouter = require('./routes/authRoute')

const Dist = require("./models/distance");
const Relay = require("./models/relay");
const Temp = require("./models/temperature");
const Table = require("./models/table");



const app = express();

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//** Sessions */
const storeDB = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions"
})


app.use(session({
  secret: 'key sceret for sign cookie',
  resave: false,
  saveUninitialized: false,
  store: storeDB
}
))

app.all('/*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//**  */
app.all('/', (req, res) => {
  res.json({ "message": "Welcome to Rest API" })
})

app.use('/api/auth', authRouter);

//** Global Error Handler */
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

//Connect to the database before listening
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("listening for requests");
    console.log(`Server listening on ${process.env.PORT} ...`)
  })
})
