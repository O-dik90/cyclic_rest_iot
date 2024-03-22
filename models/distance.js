const mongoose = require("mongoose")

const Schema = mongoose.Schema
const distanceSchema = new Schema({
  description: {
    type: string,
    require: false
  },
  distance: {
    type: string,
    require: false
  },
  mou: {
    type: string,
    require: false
  }
})

module.exports = mongoose('distance', distance)