const mongoose = require('mongoose')
const Schema = mongoose.Schema

let LocationSchema = new Schema({
  speed: { type: Number },
  heading: { type: Number },
  accuracy: { type: Number },
  altitude: { type: Number },
  longitude: { type: Number },
  latitude: { type: Number }
}, { _id: false })

module.exports = LocationSchema
