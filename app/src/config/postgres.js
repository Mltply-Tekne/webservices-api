var pg = require('postgresql-client')

var commonUserDatabase = process.env.commonUserDatabase
var commonPasswordDatabase = process.env.commonPasswordDatabase
var commonHostDatabase = process.env.commonHostDatabase
var commonPortDatabase = process.env.commonPortDatabase
var commonDatabase = process.env.commonDatabase

const connection = new pg.Connection({
    host: commonHostDatabase,
    port: commonPortDatabase,
    user: commonUserDatabase,
    password: commonPasswordDatabase,
    database: commonDatabase
});

connection.connect();
console.log('Connected to postgres')

// connection.on('close', () => connection.connect());
// connection.on('terminate', () => connection.connect());

async function execute_query(pQuery, parameters) {

    if (connection.state != 2) {
        await connection.connect();
    }

    if (connection.state == 2) {

        rows = []

        let qr = await connection.query(pQuery,{
            cursor: true,
            fetchCount: 250,
            objectRows: true,
            params: parameters
        })


        const cursor = qr.cursor;
        let row;
        
        keepSearching = 1
        while (keepSearching == 1) {
            row = await cursor.next()
            if (row != null) {
                rows.push(row)
            } else {
                keepSearching = 0
            }
        }

        await cursor.close()
        return rows
    }

}

async function execute_query_transformation(pQuery, parameters) {

    if (connection.state != 2) {
        await connection.connect();
    }

    if (connection.state == 2) {

        let qr = await connection.prepare(pQuery)
        response = qr.execute({params: parameters})
        return response
    }

}


module.exports = {execute_query_transformation, execute_query}