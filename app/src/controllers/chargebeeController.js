const chargebeeServices = require(`${process.env.srcPath}/services/chargebeeServices`)

var environment = process.env.enviroment
const fs = require('fs')


cancelPolicy = async function (request, response) {

    mBody = request.body
    
    mResponse = await chargebeeServices.cancelPolicy(mBody.policyNumber, mBody.cancelReason, mBody.cancelDate)
    
    response.json(mResponse)

}


getAllInvoices = async function (request, response) {

    mUpdatedAfterTimestamp = request.params.updatedAfterTimestamp

    mInvoiceList = await chargebeeServices.getAllInvoices(mUpdatedAfterTimestamp)

    response.json({
        success: true,
        list: mInvoiceList
    })

}

getAllSubscriptions = async function (request, response) {

    mUpdatedAfterTimestamp = request.params.updatedAfterTimestamp

    mSubscriptionList = await chargebeeServices.getAllSubscriptions(mUpdatedAfterTimestamp)

    response.json({
        success: true,
        list: mSubscriptionList
    })

}

getAllTransactions = async function (request, response) {

    mUpdatedAfterTimestamp = request.params.updatedAfterTimestamp

    mTransactionList = await chargebeeServices.getAllTransactions(mUpdatedAfterTimestamp)

    response.json({
        success: true,
        list: mTransactionList
    })

}



module.exports = {
    cancelPolicy,
    getAllSubscriptions,
    getAllInvoices,
    getAllTransactions
}