const openapi = require('openapi-comment-parser');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();
const fs = require('fs')
const path = require('path');

const PORT = process.env.PORT || 8080
const mongoose = require('mongoose');

// environment variables for mongodb connection
const MONGODB_REPLICA_HOSTNAMES = process.env.MONGODB_REPLICA_HOSTNAMES
const MONGODB_REPLICA_SET = process.env.MONGODB_REPLICA_SET
const MONGODB_DBNAME = process.env.MONGODB_DBNAME
const MONGODB_AUTH_DBNAME = process.env.MONGODB_AUTH_DBNAME || MONGODB_DBNAME
const MONGODB_CA_PATH = process.env.MONGODB_CA_PATH
const MONGODB_USER = process.env.MONGODB_USER
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD

// connection to mongodb
mongoose
    .connect('mongodb://' + MONGODB_REPLICA_HOSTNAMES + '/', {
        user: MONGODB_USER,
        pass: MONGODB_PASSWORD,
        dbName: MONGODB_DBNAME,
        replicaSet: MONGODB_REPLICA_SET,
        authSource: MONGODB_AUTH_DBNAME,
        tls: true,
        tlsCAFile: MONGODB_CA_PATH,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true})
    .catch(error => {
        console.log(error)
        process.exit(1)
    });

app.use(express.json());

const spec = openapi({
    exclude: ['deployment.yaml']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

// transaction document apis
const transactionsRoute = require('./routes/transactions.js')

app.use('/transactions', transactionsRoute);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});