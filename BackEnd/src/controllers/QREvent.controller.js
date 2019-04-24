const User = require('../models/User.model')

exports.index = function (req, res, next) {
  User.findById(res.userID).exec(function (err, user) {
    if (err) {
      return next(err)
    }
    res.QREvents = user.qrEvents
    next()
  })
}

exports.create_response = function (req, res) {
  res.QREvents.map((event) => {
    delete event._id
    delete event.__v
  })
  res.send(JSON.stringify(res.QREvents, null, '\t'))
}

exports.new = function (req, res) {
  User.findById(res.userID).exec().then(function (user) {
    user.qrEvents.push({
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
        console.log(err)
        return err
      }
      res.send('QREvent successfully stored in database')
    })
  })
}
