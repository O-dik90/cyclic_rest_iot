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
  description: {
    type: String,
    require: false
  },
})

module.exports = mongoose.model('relay', RelaySchema)