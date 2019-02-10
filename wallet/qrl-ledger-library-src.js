/********************************************************************************
 *   QRL Wallet - Ledger JS Wrapper Library
 ********************************************************************************/

var Q = require('q')

let TIMEOUT

// Include connection bus
if (typeof ledger === 'undefined') {
  ledger = require('../src')
  comm = ledger.Comm_node
  browser = false
  TIMEOUT = 25000 // ms
}
else {
  browser = true
  comm = ledger.comm_u2f
  TIMEOUT = 25 // seconds
}

// Constants
const LIBRARY_VERSION = '0.4.2'

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
        return qrl.get_version().then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().get_version() ----')
            console.log(result)
            comm.close_async()
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().get_version() ----')
            console.log(response)
            comm.close_async()
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().get_version() ----')
        console.log(e)
        comm.close_async()
        return e
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
        return qrl.get_state().then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().get_state() ----')
            console.log(result)
            comm.close_async()
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().get_state() ----')
            console.log(response)
            comm.close_async()
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().get_state() ----')
        console.log(e)
        comm.close_async()
        return e
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
        return qrl.publickey().then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().publickey() ----')
            console.log(result)
            comm.close_async()
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().publickey() ----')
            console.log(response)
            comm.close_async()
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().publickey() ----')
        console.log(e)
        comm.close_async()
        return e
      }
    }
  )
}

QrlLedger.sign = function(txn) {
  console.log('-- Calling ledger.qrl().signSend(txn) --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.signSend(txn).then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().signSend(txn) ----')
            console.log(result)
            comm.close_async()
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().signSend(txn) ----')
            console.log(response)
            comm.close_async()
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().signSend(txn) ----')
        console.log(e)
        comm.close_async()
        return e
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
        return qrl.signNext().then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().signNext() ----')
            console.log(result)
            comm.close_async()
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().signNext() ----')
            console.log(response)
            comm.close_async()
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().signNext() ----')
        console.log(e)
        comm.close_async()
        return e
      }
    }
  )
}

QrlLedger.createTx = function(source_addr, fee, dest_addr, dest_amount) {
  console.log('-- Calling ledger.qrl().createTx(source_addr, fee, dest_addr, dest_amount) --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        let response = qrl.createTx(source_addr, fee, dest_addr, dest_amount)
        console.log('---- Success calling ledger.qrl().createTx(source_addr, fee, dest_addr, dest_amount) ----')
        console.log(response)
        comm.close_async()
        return response
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().createTx(source_addr, fee, dest_addr, dest_amount) ----')
        console.log(e)
        comm.close_async()
        return e
      }
    }
  )
}

QrlLedger.createMessageTx = function(source_addr, fee, message) {
  console.log('-- Calling ledger.qrl().createMessageTx(source_addr, fee, message) --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        let response =  qrl.createMessageTx(source_addr, fee, message)
        console.log('---- Success calling ledger.qrl().createMessageTx(source_addr, fee, message) ----')
        console.log(response)
        comm.close_async()
        return response
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().createMessageTx(source_addr, fee, message) ----')
        console.log(e)
        comm.close_async()
        return e
      }
    }
  )
}

QrlLedger.retrieveSignature = function(txn) {
  console.log('-- Calling ledger.qrl().retrieveSignature(txn) --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.retrieveSignature(txn).then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().retrieveSignature(txn) ----')
            console.log(result)
            comm.close_async()
            return result
          },
          function (response) {
            // Error
            console.log('---- Error calling ledger.qrl().retrieveSignature(txn) ----')
            console.log(response)
            comm.close_async()
            return response
          }
        );
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().retrieveSignature(txn) ----')
        console.log(e)
        comm.close_async()
        return e
      }
    }
  )
}

QrlLedger.setIdx = function(idx) {
  console.log('-- Calling ledger.qrl().setIdx(idx) --')
  return comm.create_async(TIMEOUT, true).then(
    function (comm) {
      try {
        let qrl = new ledger.qrl(comm)
        return qrl.setIdx(idx).then(
          function (result) {
            // Success
            console.log('---- Success calling ledger.qrl().setIdx(idx) ----')
            console.log(result)
            comm.close_async()
            return result
          }
        )
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().setIdx(idx) ----')
        console.log(e)
        comm.close_async()
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
        return qrl.viewAddress().then(
          function (result) {
            // Success
            console.log('---- Success calling qrl.viewAddress() ----')
            console.log(result)
            comm.close_async()
            return result
          }
        )
      } catch(e) {
        console.log('---- Caught Error calling ledger.qrl().viewAddress() ----')
        console.log(e)
        comm.close_async()
        return e
      }
    }
  )
}

module.exports = QrlLedger
