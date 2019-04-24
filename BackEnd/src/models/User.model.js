const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Event = require('./Event.Schema')

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  beaconEvents: [Event],
  qrEvents: [Event]
})

module.exports = mongoose.model('User', UserSchema, 'UserCollection')
