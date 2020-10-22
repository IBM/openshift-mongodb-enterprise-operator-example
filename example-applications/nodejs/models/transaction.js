const mongoose = require('mongoose');
const Schema = mongoose.Schema
const MUUID = require('uuid-mongodb').mode('relaxed');

let uuidValidator = (id) => {
    if (id != null) {
        return MUUID.from(id.toObject())
    }
}

let Transaction = new Schema({
    transactionId: {type: Buffer, subtype: 4, default: () => MUUID.v4(), validate: {validator: uuidValidator}},
    transactionName: {type: String, required: true},
    price: {type: mongoose.Types.Decimal128 , required: true}
})

Transaction.path('transactionId').get((transactionId) => {
    return MUUID.from(transactionId.toObject());
})
Transaction.path('price').get((price) => {
    return Number(price.toString());
})
Transaction.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Transaction", Transaction)