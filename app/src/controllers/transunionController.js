const { mvrSchema } = require("../validations/transunionValidations")

var environment = process.env.credentialsEnvironment
var transunionServices = require(`${process.env.srcPath}/services/transunionServices`)
var transunionValidations = require(`${process.env.srcPath}/validations/transunionValidations.js`)


getTUVHS = async function (request, response) {


    if (request.verifyParametersBody(transunionValidations.vhsSchema)) {
        
        lVins = request.body.vins
        mQuoteRef = request.body.quoteref
        mUser = request.auth.user
        mClient = mUser + '_' + environment

        let mResponse = await transunionServices.getVhs(lVins, mQuoteRef, mClient, mUser)

        if (mResponse != undefined) {
            response.data = mResponse
            response.send_json()
        } else {
            response.status(400)
            response.json({'success': 'false'})
        }

    }

}

getTUdriverMVR = async function (request, response) {
    let pTuSchema =  await transunionValidations.mvrSchema()

    

    if (request.verifyParametersBody(pTuSchema)) {

        requestBody = request.body
        mUser = request.auth.user
        mClient = mUser + '_' + environment
        mbusinessState = request.body.businessState
        
        let mResponse = await transunionServices.getMvr(requestBody, mClient, mUser)

        if (mResponse != undefined) {
            response.data = mResponse
            response.send_json()
        } else {
            response.status(400)
            response.json({'success': 'false'})
        }
    }
    
}

initializeClient = async function (request, response) {

    let mClient = request.auth.user
    let mResponse = await transunionServices.initializeClient(mClient)

    if (mResponse != undefined) {
        response.data = mResponse
        response.send_json()
    } else {
        response.status(400)
        response.json({'success': 'false'})
    }
    
}


module.exports = {
    getTUVHS,
    getTUdriverMVR,
    initializeClient
}