var pg = require('postgresql-client')

var pouchUserDatabase = 'postgres'
var pouchPasswordDatabase = 'FG7hd8QYmIFDayuBBHDJ'
var pouchHostDatabase = '104.208.24.130'
var pouchPortDatabase = process.env.pouchPortDatabase
var pouchDatabase = process.env.pouchDatabase

const connection = new pg.Connection({
    host: pouchHostDatabase,
    port: pouchPortDatabase,
    user: pouchUserDatabase,
    password: pouchPasswordDatabase,
    database: pouchDatabase
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



module.exports = {execute_query}