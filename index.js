require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')

const Dist = require("./models/distance")
const Relay = require("./models/relay")
const Temp = require("./models/temperature");

const app = express()
const PORT = process.env.PORT || 3000

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      // useUnifieldTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

app.use(express.json());
app.all('/*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Routes go here
//**  */
app.all('/', (req, res) => {
  res.json({ "message": "Welcome to IOT Rest API" })
})

//** Routing Distance */
app.post('/dist-add', async (req, res) => {
  try {
    const dist = await Dist.create(req.body)
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
    const rel = await Relay.create(req.body)
    res.status(201).json({ message: "success add new relay"})
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
    "time_1" : req.body.time_1,
    "time_2" : req.body.time_2,
    "time_3" : req.body.time_3,
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
    const temp = await Temp.create(req.body)
    res.status(201).json({ message: "success add new temperature"})
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

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  })
})
