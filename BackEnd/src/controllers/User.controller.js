// key must be saved somewhere localy to be secured

const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const Encryption = require('../Encryption')

const privateKey = 'unbreakablekey'
const AnotherPrivateKey = 'SuperSecretKeyForRefreshToken'
const Encrypt = new Encryption(privateKey)
const jwtExpirationTime = '5h'

exports.signup = async function (req, res) {
  try {
    const encryptedPassword = await Encrypt.encrypt(req.body.password)
    const newUser = new User({
      username: req.body.username,
      password: encryptedPassword,
      beaconEvents: [],
      qrEvents: []
    })
    newUser.save((err) => {
      if (err) {
        res.send('error')
      } else {
        res.send('registered')
      }
    })
  } catch (err) {
    console.log(err)
  }
}

exports.login = function (req, res) {
  User.findOne({ username: req.body.username }).exec().then(async function (user) {
    if (req.body === null || user == null) {
      res.send('error')
    } else {
      const decryptedPassword = await Encrypt.decrypt(user.password)
      if (decryptedPassword === req.body.password) {
        try {
          const accessToken = await jwt.sign({ userID: user._id }, privateKey, { expiresIn: jwtExpirationTime })
          const refreshToken = await jwt.sign({ userID: user._id }, AnotherPrivateKey)
          const tokens = { accessToken: accessToken, refreshToken: refreshToken }
          res.send(JSON.stringify(tokens, null, '\t'))
        } catch (err) {
          res.send('error')
        }
      } else {
        res.send('error')
      }
    }
  })
}
