require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session)

const Dist = require("./models/distance");
const Relay = require("./models/relay");
const Temp = require("./models/temperature");
const Table = require("./models/table");
const User = require("./models/user");


const app = express();
const PORT = process.env.PORT || 3000;

const URI = "mongodb+srv://IOT_Admin:IOT_Admin90@iot.hvl8gvs.mongodb.net/?retryWrites=true&w=majority&appName=iot"

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || URI, {
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

const storeDB = new mongoDbSession({
  uri: URI,
  collection: "sessions"
})

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'key sceret for sign cookie',
  resave: false,
  saveUninitialized: false,
  store: storeDB
}
))


app.all('/*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Routes go here
//**  */
app.all('/', (req, res) => {
  // req.session.isAuth = true;
  console.log(req.session);
  console.log(req.session.id);
  res.json({ "message": "Welcome to IOT Rest API" })
})

//** Routing Distance */
app.post('/dist-add', async (req, res) => {
  try {
    await Dist.create(req.body)
    res.status(201).json({ message: "success add new distance" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/dist-get', async (req, res) => {
  try {
    const dist = await Dist.find()

    if (!dist) {
      res.status(200).json({ message: "data not found" })
    }
    res.status(200).json(dist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/dist-get/:id', async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const dist = await Dist.findOne(id)

    res.status(200).json(dist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

})

app.put('/dist-update/:id', async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const params = {
      "distance": req.body.distance,
      "mou": req.body.mou,
      "description": req.body.description
    }

    const dist = await Dist.findByIdAndUpdate(id, params, { new: true })

    if (!dist) {
      res.status(200).json({ message: "data not found" })
    }
    res.status(200).json(dist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete('/dist-delete/:id', async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const dist = await Dist.findByIdAndDelete(id)

    if (!dist) {
      res.status(202).json({ message: "data not found" })
    }
    res.status(200).json({ message: "success delete item" })
  } catch (error) {
    res.json(500).json({ message: error.message })
  }
})

//** Routing Relay */
app.post('/rel-add', async (req, res) => {
  try {
    await Relay.create(req.body)
    res.status(201).json({ message: "success add new relay" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/rel-get', async (req, res) => {
  try {
    const rel = await Relay.find()

    if (!rel) {
      res.status(200).json({ message: "data not found!" })
    }
    res.status(200).json(rel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/rel-get/:id', async (req, res) => {
  const id = { _id: req.params.id }

  try {
    const rel = await Relay.findById(id)

    if (!rel) {
      res.status(200).json({ message: "data not found" })
    }
    res.status(200).json(rel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/rel-update/:id', async (req, res) => {
  const id = { _id: req.params.id }
  const params = {
    "name": req.body.name,
    "status": req.body.status,
    "description": req.body.description,
    "load_1": req.body.load_1,
    "load_2": req.body.load_2,
    "load_3": req.body.load_3,
    "load_4": req.body.load_4,
    "time_1": req.body.time_1,
    "time_2": req.body.time_2,
    "time_3": req.body.time_3,
    "sync": req.body.sync
  }

  try {
    const rel = await Relay.findByIdAndUpdate(id, params, { new: true })

    if (!rel) {
      res.status(200).json({ message: "data not found" })
    }
    res.status(200).json(rel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete('/rel-delete/:id', async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const rel = await Relay.findByIdAndDelete(id)

    if (!rel) {
      res.status(202).json({ message: "data not found" })
    }
    res.status(200).json({ message: "success delete item" })
  } catch (error) {
    res.json(500).json({ message: error.message })
  }
})

//** Routing Temperature */
app.post('/temp-add', async (req, res) => {
  try {
    await Temp.create(req.body)
    res.status(201).json({ message: "success add new temperature" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/temp-get', async (req, res) => {
  try {
    const temp = await Temp.find()

    if (!temp) {
      res.status(200).json({ message: "data not found!" })
    }
    res.status(200).json(temp)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/temp-get/:id', async (req, res) => {
  const id = { _id: req.params.id }

  try {
    const temp = await Temp.findById(id)

    if (!temp) {
      res.status(200).json({ message: "data not found!" })
    }
    res.status(200).json(temp)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/temp-update/:id', async (req, res) => {
  const id = { _id: req.params.id }
  const params = {
    "temp": req.body.temp,
    "temp_unit": req.body.temp_unit,
    "hum": req.body.hum,
    "hum_unit": req.body.hum_unit,
    "ph": req.body.ph,
    "ph_unit": req.body.ph_unit,
    "description": req.body.description
  }

  try {
    const temp = await Temp.findByIdAndUpdate(id, params, { new: true })

    if (!temp) {
      temp.status(200).json({ message: "data not found" })
    }
    res.status(200).json(temp)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete('/temp-delete/:id', async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const temp = await Temp.findByIdAndDelete(id)

    if (!temp) {
      res.status(202).json({ message: "data not found" })
    }
    res.status(200).json({ message: "success delete item" })
  } catch (error) {
    res.json(500).json({ message: error.message })
  }
})

//** Routing Table */
app.get('/table-get', async (_, res) => {
  try {
    const table = await Table.find()

    if (!table) {
      res.status(200).json({ message: "data not found" })
    }
    res.status(200).json(table)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/table-add', async (req, res) => {
  try {
    await Table.create(req.body)
    res.status(201).json({ message: "success add new data" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete('/table-delete/:id', async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const table = await Table.findByIdAndDelete(id)

    if (!table) {
      res.status(404).json({ message: "data not found" })
    }
    res.status(200).json({ message: "success delete item" })
  } catch (error) {
    res.json(500).json({ message: error.message })
  }
})

app.put('/table-update/:id', async (req, res) => {
  const id = { _id: req.params.id }
  const params = {
    "first_name": req.body.first_name,
    "date": req.body.date,
    "email": req.body.email,
    "last_name": req.body.last_name,
    "phone": req.body.phone,
    "role": req.body.role,
    "status": req.body.status,
    "web": req.body.web
  }

  try {
    const table = await Table.findByIdAndUpdate(id, params, { new: true })
    if (!table) {
      table.status(404).json({ message: "data not found" })
    }
    res.status(200).json(table)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.redirect("/register");
  }

  const hashPassword = await bcrypt.hash(password, 8);
  
  user = new User({
    username, 
    email, 
    password: hashPassword
  })
  
  await user.save();
  return res.status(201).json({message: "success create"})
})

app.post("/login", async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  
  if (!user){
    return res.status(203).json({message: "not auth"});
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(202).json({message: "not match"})
  }
  
  return res.status(200).json({message: "OK"})
})

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/new", isAuth, (req, res) => {
  res.status(202).json({message: "auth"})
})


//Connect to the database before listening
//? For Deployment
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
    console.log(`Server listening on ${PORT} ...`)
  })
})

// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT} ...`)
// })