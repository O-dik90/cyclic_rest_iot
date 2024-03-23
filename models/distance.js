const mongoose = require("mongoose")

const Schema = mongoose.Schema
const DistanceSchema = new Schema({
  distance: {
    type: String,
    require: false
  },
  mou: {
    type: String,
    require: false
  },
  description: {
    type: String,
    require: false
  },
})

module.exports = mongoose.model('distance', DistanceSchema)