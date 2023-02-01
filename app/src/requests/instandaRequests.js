const got = require('got');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const fs = require('fs')
const https = require('https');

const {
    getInstandaCredentials
} = require(`${process.env.srcPath}/auth/instandaCredentials.js`)

// COMENTARIO DE AXEL. Esto debería estar en un ResquestHelper.js. No hace nada particular del método CancelPolicy, solamente ejecuta un PUT
async function cancelPolicy(pBody, pQuery, pUrl) {

    const start = Date.now()
    let jsonResponse

    var instandaCredentials = getInstandaCredentials()
    var instandaUrl = instandaCredentials.baseUrl + pUrl
    var errorMessage = undefined

    await got.put(instandaUrl, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(instandaCredentials.username + ':' + instandaCredentials.password).toString('base64')
            },
            json: pBody,
            searchParams: pQuery
        })
    .then(res => {
        jsonResponse = res.body
    })
    .catch(err => {
        
        console.log(err)
        errorMessage = err
        jsonResponse = undefined

    })
        
    // Obtain time spent on the request
    const stop = Date.now()
    let responseTime = (stop - start)/1000

    try {
        if (jsonResponse.includes('has already been cancelled') == true) {
            return {
                status: 'warning',
                error: "The policy was already cancelled on Instanda at the time of Chargebee automatic cancellation.",
                policyNumber: pQuery.policyNumber
            }
        } else {
            try {
    
                parsedJson = JSON.parse(jsonResponse)
                quoteRef = parsedJson.QuoteRef
    
                if (quoteRef != undefined) {
                    return {
                        status: 'success',
                        quoteRef: quoteRef,
                        policyNumber: pQuery.policyNumber
                    }
                } else {
                    return {
                        status: 'failed',
                        error: 'Unknown error',
                        policyNumber: pQuery.policyNumber
                    }
                }
               
            } catch {
                return {
                    status: 'failed',
                    error: 'Unknown error',
                    policyNumber: pQuery.policyNumber
                }
            }
        }
    } catch {
        return {
            status: 'failed',
            error: `Unknown error related to Instanda API.`,
            policyNumber: pQuery.policyNumber
        }
    }
    
    
}

async function getAllDocumentsDownloadLinks(pQuoteRef) {

    const start = Date.now()
    let jsonResponse

    var instandaCredentials = getInstandaCredentials('production')
    var instandaUrl = instandaCredentials.baseUrl + '/GetAllDocumentsLinks'
    var errorMessage = undefined

    await got.get(instandaUrl, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(instandaCredentials.username + ':' + instandaCredentials.password).toString('base64')
            },
            searchParams: {
                quoteRef: pQuoteRef
            }
        })
    .then(res => {
        jsonResponse = JSON.parse(res.body)
    })
    .catch(err => {
        
        console.log(err)
        errorMessage = err
        jsonResponse = undefined

    })
        
    // Obtain time spent on the request
    const stop = Date.now()
    let responseTime = (stop - start)/1000
    
    return jsonResponse
}

async function getPolicyPdfBase64(pUrl) {

    const start = Date.now()

    var instandaCredentials = getInstandaCredentials('production')
    var errorMessage = undefined

    await got.get(pUrl, {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(instandaCredentials.username + ':' + instandaCredentials.password).toString('base64')
        }
    })
    .then(res => {
        base64 = res.body
    })
    .catch(err => {
        
        console.log(err)
        errorMessage = err
        base64 = undefined

    })
    
    return base64
}



async function makeCancelRequestToInstanda(mBody, mQuery) {

    mInstandaURL = '/CancelPolicy'

    return cancelPolicy(mBody, mQuery, mInstandaURL)
    
}

module.exports = {
    makeCancelRequestToInstanda,
    getAllDocumentsDownloadLinks,
    getPolicyPdfBase64
}