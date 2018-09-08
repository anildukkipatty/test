const md5 = require('md5')
const config = require('./config')

const ledger = []
const transaction = function (height, tx, hash, prevHash) {
  return {
    height,
    tx,
    hash,
    prevHash
  }
}
function getLatestTx () {
  return ledger[ledger.length - 1] || {tx: {}, height: 0}
}
function getLedger () {
  return ledger
}
function insertTransaction (tx) {
  let hash = md5(JSON.stringify(Object.assign({}, tx, { prevHash: getLatestTx().hash })))
  let prevHash = md5(JSON.stringify(getLatestTx()))

  let height = getLatestTx().height + 1

  const t = transaction(height, tx, hash, prevHash)
  ledger.push(t)
}
function fetchNetwork (req, res) {
  return config
}
module.exports = { transaction, getLatestTx, getLedger, insertTransaction, fetchNetwork }