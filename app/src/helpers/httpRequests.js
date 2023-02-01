const got = require('got');

async function postRequest (pUrl, pParameters) {

    const start = Date.now()

    await got.post(pUrl, pParameters)
    .then(res => {
        mResponseBody = res.body
        mResponseBodyParsed = JSON.parse(res.body)
    })
    .catch(err => {
        
        console.log(err)
        console.log(err.response.body)
        mResponseBody = undefined

    })
      
    // Obtain time spent on the request
    const stop = Date.now()
    let responseTime = (stop - start)/1000

    let mRequestResponse = {
        raw: mResponseBody,
        parsed: mResponseBodyParsed,
        responseTime: responseTime
    }

    return mRequestResponse
}

async function getRequest (pUrl, pParameters) {

    const start = Date.now()

    await got.get(pUrl, pParameters)
    .then(res => {
        mResponseBody = res.body
        mResponseBodyParsed = JSON.parse(res.body)
    })
    .catch(err => {
        
        console.log(err)
        console.log(err.response.body)
        mResponseBody = undefined

    })
      
    // Obtain time spent on the request
    const stop = Date.now()
    let responseTime = (stop - start)/1000

    let mRequestResponse = {
        raw: mResponseBody,
        parsed: mResponseBodyParsed,
        responseTime: responseTime
    }

    return mRequestResponse
}

module.exports = {
    postRequest,
    getRequest
}