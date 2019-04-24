const express = require('express')
const bodyParser = require('body-parser')
const UserQRRouter = require('./routes/UserQR.route')
const UserBeaconRouter = require('./routes/UserBeacon.route')
const UserRouter = require('./routes/User.route')
const app = express()
const path = require('path')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Setup Database
const mongoose = require('mongoose')
let mongoDB = process.env.MONGODB_URI || 'mongodb+srv://aposalo:Galactus_234@cluster0-rpvpn.mongodb.net/test?retryWrites=true'
mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise
let db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', function (req, res) { // TODO login kai meta blepw oti QR kai Beacons exei apo8hkseusei o xrhsths
  res.render('login')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/User/BeaconEvents', UserBeaconRouter)
app.use('/User/QREvents', UserQRRouter)
app.use('/User', UserRouter)

const port = 9999
app.listen(port, '0.0.0.0', () => {
  console.log('Server is up and running on port number ' + port)
})
