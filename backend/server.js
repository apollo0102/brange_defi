const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const refer = require('./routes/api/refer')
const cors = require('cors')
const { prototype } = require('events')

const resolvePath = require('path').resolve

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(resolvePath(__dirname, './build')))

// app.use(cors({
//   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
// }));
// DB Config
const db = require('./config/keys').mongoURI

// Connect to Mongo
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected ..!!!'))
  .catch((err) => {
    console.log(err)
  })

// Use Routes
app.use('/api', refer)

// app.get('/*', (req, res) => {
//   const contents = fs.readFileSync(
//     resolvePath(__dirname, './build/index.html'),
//     'utf8',
//   )
//   res.send(contents)
// })

const port = 5000

app.listen(port, function() {
  console.log("Server is running on Port: " + port);
});
