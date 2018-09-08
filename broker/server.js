const express = require('express')
const bodyParser = require('body-parser')
const { List } = require('immutable-ext')
const Task = require('data.task')
const { get } = require('../lib/http')
const { insertTransaction, getLedger, fetchNetwork } = require('./lib')
const app = express()
app.use(bodyParser.json())

app.get('/', renderIndex)

app.get('/askToSync', askToSync)
app.post('/syncPeer', syncPeer)
app.get('/showLedger', showLedger)
app.get('/showNetwork', showNetwork)

app.post('/addToLedger', addToLedger)
app.get('/test', test)

function renderIndex (req, res) {
  res.send('BROKER running')
}
function askToSync (req, res) {
  console.log('aa');
  
  List(fetchNetwork().peers)
  .traverse(Task.of, (peer) => {
    return get(`${peer.ip_address}/syncLedger`)
  })
  .fork(err => res.send({err, code: 'FAIL'}), r => res.send(r))
}
function syncPeer (req, res) {
  let transactions = getLedger().filter(tx => tx.height > req.body.latestHeight)
  res.send(transactions)
}
function showLedger (req, res) {
  return res.send(getLedger())
}
function showNetwork (req, res) {
  return res.send(fetchNetwork())
}

function addToLedger (req, res) {
  insertTransaction(req.body)
  res.send({})
}
function test (req, res) {
  insertTransaction({name: 'credit', payload: {to: 'anil', from: 'chaitu', amount: 10}})
  insertTransaction({name: 'credit', payload: {to: 'anil', from: 'chaitu', amount: 10}})
  insertTransaction({name: 'credit', payload: {to: 'chaitu', from: 'anil', amount: 10}})

  askToSync(req, res)

}

app.listen('9999')