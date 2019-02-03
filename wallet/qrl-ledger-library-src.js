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
const LIBRARY_VERSION = '0.3.1'
const TIMEOUT_SECONDS = 25

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
  return comm.create_async(TIMEOUT_SECONDS, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.get_version().then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().get_version() ----')
            console.log(result)
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().get_version() ----')
            console.log(response)
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().get_version() ----')
        console.log(e)
        return e
      }
    }
  )
}

QrlLedger.get_state = function() {
  console.log('-- Calling ledger.qrl().get_state() --')
  return comm.create_async(TIMEOUT_SECONDS, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.get_state().then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().get_state() ----')
            console.log(result)
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().get_state() ----')
            console.log(response)
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().get_state() ----')
        console.log(e)
        return e
      }
    }
  )
}

QrlLedger.publickey = function() {
  console.log('-- Calling ledger.qrl().publickey() --')
  return comm.create_async(TIMEOUT_SECONDS, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.publickey().then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().publickey() ----')
            console.log(result)
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().publickey() ----')
            console.log(response)
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().publickey() ----')
        console.log(e)
        return e
      }
    }
  )
}

QrlLedger.sign = function(txn) {
  console.log('-- Calling ledger.qrl().signSend(txn) --')
  return comm.create_async(TIMEOUT_SECONDS, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.signSend(txn).then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().signSend(txn) ----')
            console.log(result)
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().signSend(txn) ----')
            console.log(response)
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().signSend(txn) ----')
        console.log(e)
        return e
      }
    }
  )
}

QrlLedger.signNext = function() {
  console.log('-- Calling ledger.qrl().signNext() --')
  return comm.create_async(TIMEOUT_SECONDS, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.signNext().then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().signNext() ----')
            console.log(result)
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().signNext() ----')
            console.log(response)
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().signNext() ----')
        console.log(e)
        return e
      }
    }
  )
}

QrlLedger.createTx = function(source_addr, fee, dest_addr, dest_amount) {
  console.log('-- Calling ledger.qrl().createTx(source_addr, fee, dest_addr, dest_amount) --')
  return comm.create_async(TIMEOUT_SECONDS, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.createTx(source_addr, fee, dest_addr, dest_amount)
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().createTx(source_addr, fee, dest_addr, dest_amount) ----')
        console.log(e)
        return e
      }
    }
  )
}

QrlLedger.createMessageTx = function(source_addr, fee, message) {
  console.log('-- Calling ledger.qrl().createMessageTx(source_addr, fee, message) --')
  return comm.create_async(TIMEOUT_SECONDS, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.createMessageTx(source_addr, fee, message)
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().createMessageTx(source_addr, fee, message) ----')
        console.log(e)
        return e
      }
    }
  )
}

QrlLedger.retrieveSignature = function(txn) {
  console.log('-- Calling ledger.qrl().retrieveSignature(txn) --')
  return comm.create_async(TIMEOUT_SECONDS, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.retrieveSignature(txn).then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().retrieveSignature(txn) ----')
            console.log(result)
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().retrieveSignature(txn) ----')
            console.log(response)
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().retrieveSignature(txn) ----')
        console.log(e)
        return e
      }
    }
  )
}

QrlLedger.setIdx = function(idx) {
  console.log('-- Calling ledger.qrl().setIdx(idx) --')
  return comm.create_async(TIMEOUT_SECONDS, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.setIdx(idx)
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().setIdx(idx) ----')
        console.log(e)
        return e
      }
    }
  )
}

QrlLedger.viewAddress = function() {
  console.log('-- Calling ledger.qrl().viewAddress() --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.viewAddress()
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().viewAddress() ----')
        console.log(e)
      }
    }
  )
}

module.exports = QrlLedger
