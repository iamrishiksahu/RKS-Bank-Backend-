const express = require('express')
const router = express.Router()


const {getAccountBalance, updateAccountBalance} = require('../controllers/account/balanceController');

const {getAccountInfo, updateAccountInfo, createNewAccount, deleteAccount} = require('../controllers/account/acountController');

const {performTransaction} = require('../controllers/account/transactionController');


/** Account Routes */
router.get('/', getAccountInfo)
router.post('/create', createNewAccount)
router.post('/update', updateAccountInfo)
router.post('/delete', deleteAccount)


/** Balance Routes */
router.get('/balance', getAccountBalance);

/** Transaction Router */
router.post('/transaction', performTransaction)

module.exports = router


