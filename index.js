require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')

const Dist = require("./models/distance")

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
app.all('/', (req, res) => {
  res.json({ "every thing": "is awesome" })
})

app.post('/add-dist', async (req, res) => {
  try {
    const dist = await Dist.create(req.body)
    res.status(200).json({ message: "success add new distance!", value: dist })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/get-dist', async (req, res) => {
  const dist = await Dist.find()

  if (dist) {
    res.status(200).json(dist)
  } else {
    res.status(500).json({ message: "error" })
  }
})

app.get('/getItem-dist/:id', async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const dist = await Dist.findOne(id)

    res.status(200).json(dist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

})

app.put('/putItem-dist/:id', async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const params = {
      "distance": req.body.distance, 
      "mou": req.body.mou, 
      "description": req.body.description
    }

    const dist = await Dist.findByIdAndUpdate(id, params, {new : true})

    if (!dist) {
      res.status(502).json({ message: "data not found" })
    }
    res.status(200).json(dist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete('/deleteItem-dist/:id', async (req, res) => {
  try {
    const id = { _id: req.params.id }
    const dist = await Dist.findByIdAndDelete(id)
    
    if (!dist) {
      res.status(502).json({ message: "data not found" })
    }
    res.status(200).json({ message : "success delete item"})
  } catch (error) {
    res.json(500).json({ message: error.message})
  }
})


//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  })
})
