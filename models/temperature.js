const mongoose = require("mongoose")

const Schema = mongoose.Schema
const TemperatureSchema = new Schema({
  temp: { type: String, require: false },
  temp_unit: { type: String, require: false },
  hum: { type: String, require: false },
  hum_unit: { type: String, require: false },
  ph: { type: String, require: false },
  ph_unit: { type: String, require: false },
  description: { type: String, require: false },
})

module.exports = mongoose.model('temperature', TemperatureSchema)