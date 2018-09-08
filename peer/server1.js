const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { post } = require('../lib/http')
const { getLatestTx, getLedger, insertToLedger } = require('./lib')

app.get('/', renderIndex)
app.get('/syncLedger', syncLedger)
app.get('/showLedger', showLedger)

function renderIndex (req, res) {
  res.send('PEER1 running')
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