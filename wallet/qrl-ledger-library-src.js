/********************************************************************************
 *   QRL Wallet - Ledger JS Wrapper Library
 ********************************************************************************/

var Q = require('q')

// Include connection bus
if (typeof ledger === 'undefined') {
  ledger = require('../src')
  comm = ledger.comm_node
  browser = false
}
else {
  browser = true
  comm = ledger.comm_u2f
}

// Constants
const LIBRARY_VERSION = '0.0.1'
const TIMEOUT = 1000
const SHOR_PER_QUANTA = 1000000000

// Create object to store all library functions in
var QrlLedger = {}

/**
 * function
 * version: reports current library version
 */
QrlLedger.library_version = async function() {
  return LIBRARY_VERSION
}

/**
 * function
 * ledger_app_version: reports current version of qrl app on ledger device
 */
QrlLedger.app_version = function() {
  console.log('-- Calling ledger.qrl().get_version() --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.get_version().then(function (result) {
          return result
        })
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().get_version() ----')
        console.log(e)
      }
    }
  )
}

QrlLedger.get_state = function() {
  console.log('-- Calling ledger.qrl().get_state() --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.get_state().then(function (result) {
          return result
        })
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().get_state() ----')
        console.log(e)
      }
    }
  )
}

QrlLedger.publickey = function() {
  console.log('-- Calling ledger.qrl().publickey() --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.publickey().then(function (result) {
          return result
        })
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().publickey() ----')
        console.log(e)
      }
    }
  )
}

QrlLedger.sign = function(txn) {
  console.log('-- Calling ledger.qrl().sign(txn) --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.sign(txn).then(function (result) {
          console.log(result)
          return result
        })
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().sign(txn) ----')
        console.log(e)
      }
    }
  )
}

QrlLedger.signNext = function() {
  console.log('-- Calling ledger.qrl().signNext() --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.signNext().then(function (result) {
          return result
        })
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().signNext() ----')
        console.log(e)
      }
    }
  )
}

module.exports = QrlLedger
