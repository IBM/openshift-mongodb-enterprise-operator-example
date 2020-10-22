const express = require("express");
const router = express.Router();
const uuid = require('uuid')
const MUUID = require('uuid-mongodb').mode('relaxed');
const Transaction = require('../models/transaction.js')

const excludeFields = {__v: false, _id: false}

/**
 * GET /transactions
 * @tag transaction
 * @summary Get all transactions
 * @description This gets all the transactions in the database
 * @response 200 - success
 * @responseContent {Transaction[]} 200.application/json
 */
router.get("/", (req, res) => {
    Transaction.find({}, excludeFields,(err, transactions) => {
        if (err) {
            res.err(err)
        } else {
            let map = transactions;
            res.send(transactions)
        }
    })
})

/**
 * GET /transactions/{transactionId}
 * @tag transaction
 * @summary Get a single transaction with an id
 * @description This gets a single transactions in the database
 * @pathParam {string} transactionId - transaction ID
 * @response 200 - success
 * @responseContent {Transaction} 200.application/json
 * @response 404 - Transaction not found.
 */
router.get("/:transactionId", (req, res) => {
    let transactionId = req.params.transactionId
    if (!uuid.validate(transactionId)) {
        res.status('400').send({err: "Invalid transactionId"})
        return
    }

    Transaction.findOne({transactionId: MUUID.from(req.params.transactionId)}, excludeFields,(err, transaction) => {
        if (err) {
            res.err(err)
        } else {
            console.log
            if (!transaction) {
                res.status('404').send({status: "Transaction not found."})
                return
            }
            res.send(transaction)
        }
    })
})

/**
 * POST /transactions
 * @tag transaction
 * @summary Create new transaction
 * @description This creates a new transaction in the database
 * @bodyContent {NewTransaction} application/json
 * @bodyRequired
 * @response 201 - Created new transaction.
 */
router.post("/", (req, res) => {
    if (req.body.transactionId) {
        res.status('400').send({err: "Body must not include transactionId"})
        return
    }

    let newTransaction = new Transaction(req.body)
    newTransaction.save(err => {
        if (err) {
            res.status('400').send(err)
        } else {
            res.status('201').send('Created new transaction.')
        }
    })
})

module.exports = router;