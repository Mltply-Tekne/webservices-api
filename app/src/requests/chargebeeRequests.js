const got = require('got');

const { clients } = require(`${process.env.srcPath}/auth/clientsCredentials`)
var environment = process.env.credentialsEnvironment

const chargebeeCredentials = clients.pouch.chargebee[environment]

const baseUrl = chargebeeCredentials.baseUrl
const apikey = chargebeeCredentials.apikey


async function getSuscription(pSubscriptionCode) {

    await got.get(`${baseUrl}/subscriptions/` + pSubscriptionCode , 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json'
            },
            username: apikey
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response
    
}

async function getSubscriptionEstimate(pSubscriptionCode) {


    await got.get(`${baseUrl}/subscriptions/${pSubscriptionCode}/renewal_estimate`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json'
            },
            username: apikey
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response
}

async function getTransaction(pTransactionId) {

    await got.get(`${baseUrl}/transactions/` + pTransactionId , 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json'
            },
            username: apikey
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response
}

async function getInvoice(pInvoiceId) {

    await got.get(`${baseUrl}/invoices/` + pInvoiceId , 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json'
            },
            username: apikey
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response
}

async function getInvoiceList(pNextOffset, pUpdatedAfterTimestamp) {

    // mSeachParameters = {
    //     limit: 100
    // }

    if (pNextOffset != '') {
        pNextOffset = `&offset=${pNextOffset}`
    }
    

    await got.get(`${baseUrl}/invoices?include_deleted=true&updated_at[after]=${pUpdatedAfterTimestamp}&limit=100${pNextOffset}`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json'
            },
            username: apikey
            // searchParams: mSeachParameters
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response
}

async function getSubscriptionList(pNextOffset, pUpdatedAfterTimestamp) {

    if (pNextOffset != '') {
        pNextOffset = `&offset=${pNextOffset}`
    }
    

    await got.get(`${baseUrl}/subscriptions?include_deleted=true&updated_at[after]=${pUpdatedAfterTimestamp}&limit=100${pNextOffset}`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json'
            },
            username: apikey
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response
}

async function getCustomer(pCustomerId) {

    await got.get(`${baseUrl}/customers/` + pCustomerId , 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json'
            },
            username: apikey
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response
}

async function getTransactionList(pNextOffset, pUpdatedAfterTimestamp) {

    if (pNextOffset != '') {
        pNextOffset = `&offset=${pNextOffset}`
    }
    

    await got.get(`${baseUrl}/transactions?include_deleted=true&updated_at[after]=${pUpdatedAfterTimestamp}&limit=100${pNextOffset}`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json'
            },
            username: apikey
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response
}


module.exports = {
    getSuscription,
    getSubscriptionEstimate,
    getTransaction,
    getInvoice,
    getInvoiceList,
    getSubscriptionList,
    getTransactionList,
    getCustomer
}