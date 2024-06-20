const mongoose = require("mongoose")

const Schema = mongoose.Schema
const TableSchema = new Schema({
  first_name: { type: String, require: false },
  last_name: { type: String, require: false },
  date: { type: Date, require: false },
  status: { type: Boolean, require: false },
  role: { type: String, require: false },
  email: { type: String, require: false },
  phone: { type: String, require: false }
})

module.exports = mongoose.module('table', TableSchema)