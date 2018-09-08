let ledger = []
function getLedger () {
  return ledger
}
function getLatestTx () {
  return ledger[ledger.length - 1] || {tx: {}, height: 0}
}
function insertToLedger (transactions) {
  ledger = ledger.concat(transactions)
}

module.exports = { getLatestTx, getLedger, insertToLedger }