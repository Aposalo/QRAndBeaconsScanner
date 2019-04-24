const User = require('../models/User.model')

exports.index = function (req, res, next) {
  User.findById(res.userID).exec(function (err, user) {
    if (err) {
      return next(err)
    }
    res.BeaconEvents = user.beaconEvents
    next()
  })
}

exports.create_response = function (req, res) {
  res.BeaconEvents.map((event) => {
    delete event._id
    delete event.__v
  })
  res.send(JSON.stringify(res.BeaconEvents, null, '\t'))
}

exports.new = function (req, res, next) {
  User.findById(res.userID).exec().then(function (user) {
    user.beaconEvents.push({
      timeStamp: req.body.timeStamp,
      location: {
        speed: req.body.location.speed,
        heading: req.body.location.heading,
        accuracy: req.body.location.accuracy,
        altitude: req.body.location.altitude,
        longitude: req.body.location.longitude,
        latitude: req.body.location.latitude
      },
      data: req.body.data
    })
    user.save((err) => {
      if (err) {
        return next(err)
      }
      res.send('BeaconEvent successfully stored in database')
    })
  })
}
