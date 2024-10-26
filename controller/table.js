const Table = require("../models/table");

const tablesGet = async (_, res) => {
  try {
    const table = await Table.find()

    if (!table) {
      res.status(200).json({ message: "data not found" })
    }
    res.status(200).json(table)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const tablesAdd = async (req, res) => {
  try {
    await Table.create(req.body)
    res.status(201).json({ message: "success add new data" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const tablesDelete = async (req, res) => {
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
}

const tablesUpdate = async (req, res) => {
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
}

module.exports = {
  tablesGet,
  tablesAdd,
  tablesDelete,
  tablesUpdate
}