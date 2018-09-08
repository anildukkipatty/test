const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const { post } = require('../lib/http')
const { getLatestTx, getLedger, insertToLedger } = require('./lib')

app.use(express.static(path.resolve('html/public')))

app.get('/', renderIndex)
app.get('/syncLedger', syncLedger)
app.get('/showLedger', showLedger)

function renderIndex (req, res) {
  res.sendFile(path.resolve('html/nse.html'))
}
function syncLedger (req, res) {
  post('http://localhost:9999/syncPeer', { latestHeight: getLatestTx().height })
  .fork(err => {}, transactions => {
    insertToLedger(transactions)
    io.emit('data', transactions)
    return res.send('OK')
  })
}
function showLedger (req, res) {
  return res.send(getLedger())
}

server.listen('4000')