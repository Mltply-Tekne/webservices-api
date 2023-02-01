const got = require('got');

const { clients } = require(`${process.env.srcPath}/auth/clientsCredentials`)
const {parseDates} = require(`${process.env.srcPath}/helpers/jsonHelpers`)
var environment = process.env.credentialsEnvironment


const externalRequestsCredentials = clients.pouch.externalRequests[environment]

const baseUrl = externalRequestsCredentials.baseUrl
const requestToken = externalRequestsCredentials.token


async function getPolicyNumber(pPolicyNumber) {

    await got.get(`${baseUrl}/v1/getpolicynumber`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json',
                'token': requestToken
            },
            searchParams: {
                pouchpolicynumber: pPolicyNumber
            }
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response['policynumber']
}

async function getSharepointCancelInformation(pQuoteRef) {

    await got.get(`${baseUrl}/v1/getSharepointCancelInformation`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json',
                'token': requestToken
            },
            searchParams: {
                quoteRef: pQuoteRef
            }
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response['response']
}

async function getPolicyRegex() {

    await got.get(`${baseUrl}/v1/getBusinessStates`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json',
                'token': requestToken
            }
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return RegExp(response.response.policyRegexPattern)
}

async function insertChargebeeLog(log) {

    await got.post(`${baseUrl}/v1/chargebee/insertLog`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json',
                'token': requestToken
            },
            json: log
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return 'ok'
}

async function updateChargebeeInvoiceData(pDataObj) {

    await got.post(`${baseUrl}/v1/chargebee/updateInvoiceData`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json',
                'token': requestToken
            },
            json: pDataObj
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return 'ok'
}

async function updateChargebeeSubscriptionData(pDataObj) {

    await got.post(`${baseUrl}/v1/chargebee/updateSubscriptionData`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json',
                'token': requestToken
            },
            json: pDataObj
        })
    .then(res => {
        let jObj = res.body;
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return 'ok'
}

async function getDataset(pDatasetName, pFilters) {

    await got.post(`${baseUrl}/v1/getDataset/${pDatasetName}`, 
        {
            responseType: 'json',
            headers: {
                'accept': 'application/json',
                'token': requestToken
            },
            json: pFilters
        })
    .then(res => {
        let jObj = parseDates(res.body);
        response = jObj
    })
    .catch(err => {
        console.log(err)
        response = undefined
    })

    return response
}


module.exports = {
    getPolicyNumber, 
    getSharepointCancelInformation,
    insertChargebeeLog,
    updateChargebeeInvoiceData,
    getPolicyRegex,
    getDataset,
    updateChargebeeSubscriptionData
}