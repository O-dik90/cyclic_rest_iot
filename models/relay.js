const mongoose = require("mongoose")

const Schema = mongoose.Schema
const RelaySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    require: true
  },
  sync: {
    type: Boolean,
    require: false
  },
  description: {
    type: String,
    require: false
  },
  load_1: {
    type: String,
    require: false
  },
  load_2: {
    type: String,
    require: false
  },
  load_3: {
    type: String,
    require: false
  },
  load_4: {
    type: String,
    require: false
  },
  time_1: {
    type: String,
    require: false
  },
  time_2: {
    type: String,
    require: false
  },
  time_3: {
    type: String,
    require: false
  },
})

module.exports = mongoose.model('relay', RelaySchema)