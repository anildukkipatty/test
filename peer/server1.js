const express = require('express')
const { post } = require('../lib/http')
const { getLatestTx, getLedger, insertToLedger } = require('./lib')
const app = express()

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
    return res.send('OK')
  })
}
function showLedger (req, res) {
  return res.send(getLedger())
}

app.listen('4000')