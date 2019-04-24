// maybe add code to refresh token
const jwt = require('jsonwebtoken')
const privateKey = 'unbreakablekey'
const AnotherPrivateKey = 'SuperSecretKeyForRefreshToken'
const jwtExpirationTime = '5h'

exports.isAuthenticated = async function (req, res, next) {
  const token = req.headers['x-access-token']
  try {
    const decodedToken = await jwt.verify(token, privateKey)
    res.userID = decodedToken.userID
    next()
  } catch (err) {
    res.status(498).send(err.name)
  }
}

exports.refreshToken = async function (req, res) {
  const refreshToken = req.headers['x-access-token']
  try {
    const decodedRefreshedToken = await jwt.verify(refreshToken, AnotherPrivateKey)
    const newAccessToken = await jwt.sign({ userID: decodedRefreshedToken.userID }, privateKey, { expiresIn: jwtExpirationTime })
    res.send(newAccessToken)
  } catch (err) {
    res.send(err.message)
    console.log(err)
  }
}
