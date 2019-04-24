const mongoose = require('mongoose')
const Schema = mongoose.Schema
const LocationSchema = require('./LocationSchema')

const EventSchema = new Schema({
  timeStamp: { type: String, required: true },
  location: LocationSchema,
  data: { type: String, required: true }
})

module.exports = EventSchema
