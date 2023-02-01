// Request Files
const instandaRequests = require(`${process.env.srcPath}/requests/instandaRequests.js`)
const chargebeeRequests = require(`${process.env.srcPath}/requests/chargebeeRequests.js`)
const pouchRequests = require(`${process.env.srcPath}/requests/pouchRequests.js`)

// Libraries
var excelModule = require(`${process.env.srcPath}/config/excels.js`);

// Credentials
const clientsCredentials = require(`${process.env.srcPath}/auth/clientsCredentials`)
var credentialsEnvironment = process.env.credentialsEnvironment
var environment = process.env.environment

// Sharepoint lists module
const sharepointListRequests = require(`${process.env.srcPath}/requests/microsoftGraph/sharepointListRequests`)
credentialsEnvironment
const emails = require(`${process.env.srcPath}/config/emails`)


// Invoices
async function getAllInvoices(pUpdatedAfterTimestamp) {

    // Defining a list where all the invoices will be stored
    mInvoiceList = []

    // Setting this variable so the first run, runs without nextOffset
    mNextOffset = ''

    // Getting policy regex for further use
    mPolicyRegex = await pouchRequests.getPolicyRegex()

    // Looping until the nextOffset returns undefined
    while (mNextOffset != undefined) {

        mNextOffset = await getInvoiceList(mNextOffset, pUpdatedAfterTimestamp)

    }

    return mInvoiceList

}

async function getInvoiceList(mNextOffset, pUpdatedAfterTimestamp) {

    mRawInvoiceRequest = await chargebeeRequests.getInvoiceList(mNextOffset, pUpdatedAfterTimestamp)

    for (rawInvoiceRequest of mRawInvoiceRequest.list) {

        mInvoice = rawInvoiceRequest.invoice
        
        // Replacing special characters in the description (Gloria and Andres proof)
        mInvoice.line_items[0].description = (mInvoice.line_items[0].description).replace(/\n/g, " ")
        mInvoice.line_items[0].description = (mInvoice.line_items[0].description).replace(/\t/g, " ")

        let mPolicyNumber = null

        if (mInvoice.deleted == false) {
            mPolicyNumber = await obtainPolicyNumber(mInvoice, undefined, mPolicyRegex)
        }
    

        var invoiceObj = {
            customerId: mInvoice.customer_id,
            subscriptionId: (mInvoice.subscription_id || null),
            invoiceNumber: parseInt(mInvoice.id),
            policyNumber: mPolicyNumber,
            status: mInvoice.status,
            updatedAt: new Date((mInvoice.updated_at) * 1000),
            invoiceDate: new Date((mInvoice.date) * 1000),
            invoiceStart: new Date((mInvoice.generated_at) * 1000),
            invoicePaidOn: new Date((mInvoice.paid_at) * 1000),
            invoiceAmount: (mInvoice.total) / 100,
            invoicePaidAmount: (mInvoice.amount_paid) / 100,
            invoiceDescription: mInvoice.line_items[0].description,
            datefrom: new Date((mInvoice.line_items[0].date_from) * 1000),
            dateto: new Date((mInvoice.line_items[0].date_to) * 1000),
            duedate: new Date((mInvoice.due_date) * 1000),
            lasttransactionid: (mInvoice.linked_payments.slice(-1).pop()?.txn_id || null),
            deleted: mInvoice.deleted
            
        }

        mInvoiceList.push(invoiceObj)

    }

    return mRawInvoiceRequest.next_offset

}


// Transactions
async function getAllTransactions(pUpdatedAfterTimestamp) {

    // Defining a list where all the Transactions will be stored
    mTransactionList = []

    // Setting this variable so the first run, runs without nextOffset
    mNextOffset = ''

    // Looping until the nextOffset returns undefined
    while (mNextOffset != undefined) {

        mNextOffset = await getTransactionList(mNextOffset, pUpdatedAfterTimestamp)

    }

    return mTransactionList

}

async function getTransactionList(mNextOffset, pUpdatedAfterTimestamp) {

    mRawTransactionRequest = await chargebeeRequests.getTransactionList(mNextOffset, pUpdatedAfterTimestamp)

    for (mTransaction of mRawTransactionRequest.list) {

        // if (mTransaction.transaction.linked_invoices != undefined) {
        //     if ((mTransaction.transaction.linked_invoices).length != 1) {
        //         console.log('a')
        //     }
        // } else {
        //     console.log('b')
        // }

        // If the transaction is voided, we dont have invoice number
        try {

            for (mInvoice of mTransaction.transaction.linked_invoices) {

                transactionObj = {
                    transactionid: mTransaction.transaction.id,
                    customerid: mTransaction.transaction.customer_id,
                    subscriptionid: mTransaction.transaction.subscription_id,
                    invoicenumber: mInvoice.invoice_id,
                    status: mTransaction.transaction.status,
                    amount: (mTransaction.transaction.amount) / 100,
                    amountunused: (parseFloat(mTransaction.transaction.amount_unused) || 0),
                    date:  new Date((mTransaction.transaction.date) * 1000),
                    maskedcardnumber: (mTransaction.transaction.masked_card_number || null),
                    paymentmethod: (mTransaction.transaction.payment_method || null),
                    errortext: (mTransaction.transaction.error_text || null),
                    errorcode: (mTransaction.transaction.error_code || null),
                    updatedat: new Date((mTransaction.transaction.updated_at) * 1000),
                    deleted: (mTransaction.transaction.deleted || false),
                    modifiedon: new Date()
                }

                mTransactionList.push(transactionObj)
    
            }

        } catch (e) {

            // console.log(e)

            transactionObj = {
                transactionid: mTransaction.transaction.id,
                customerid: mTransaction.transaction.customer_id,
                subscriptionid: mTransaction.transaction.subscription_id,
                invoicenumber: null,
                status: mTransaction.transaction.status,
                amount: (mTransaction.transaction.amount) / 100,
                amountunused: (parseFloat(mTransaction.transaction.amount_unused) || 0),
                date:  new Date((mTransaction.transaction.date) * 1000),
                deleted: (mTransaction.transaction.deleted || false)
            }

            mTransactionList.push(transactionObj)

        }

    }

    return mRawTransactionRequest.next_offset

}


// Subscriptions
async function getAllSubscriptions(pUpdatedAfterTimestamp) {

    // Defining a list where all the subscriptions will be stored
    mSubscriptionList = []

    // Setting this variable so the first run, runs without nextOffset
    mNextOffset = ''

    // Looping until the nextOffset returns undefined
    while (mNextOffset != undefined) {

        mNextOffset = await getSubscriptionList(mNextOffset, pUpdatedAfterTimestamp)

    }

    return mSubscriptionList

}

async function getSubscriptionList(mNextOffset, pUpdatedAfterTimestamp) {

    mRawSubscriptionRequest = await chargebeeRequests.getSubscriptionList(mNextOffset, pUpdatedAfterTimestamp)

    for (mSubscription of mRawSubscriptionRequest.list) {

        // Getting the next payment amount from Estimates API chargebee
        if (!['cancelled', 'non_renewing'].includes(mSubscription.subscription.status)) {

            try {

                nextEstimate = await chargebeeRequests.getSubscriptionEstimate(mSubscription.subscription.id)
                nextPaymentAmount = nextEstimate.estimate.invoice_estimate.total

            } catch (e) {

                console.log(e)

            }

        } else {

            nextPaymentAmount = null

        }
        
        subscriptionObj = {
            customerid: mSubscription.subscription.customer_id,
            eventid: null,
            subscriptionid: mSubscription.subscription.id,
            policynumber: mSubscription.subscription.cf_policy_number,
            status: mSubscription.subscription.status,
            cancelreason: mSubscription.subscription.cancel_reason,
            cancelledat: new Date((mSubscription.subscription.cancelled_at) * 1000),
            startedat: new Date((mSubscription.subscription.started_at) * 1000),
            updatedat:new Date(( mSubscription.subscription.updated_at) * 1000),
            currenttermstart: new Date((mSubscription.subscription.current_term_start) * 1000),
            currenttermend: new Date((mSubscription.subscription.current_term_end) * 1000),
            nextbillingat:new Date(( mSubscription.subscription.next_billing_at) * 1000),
            dueinvoicescount: (parseInt(mSubscription.subscription.due_invoices_count) || 0),
            duesince: new Date((mSubscription.subscription.due_since) * 1000),
            remainingbillingcycles: (parseInt(mSubscription.subscription.remaining_billing_cycles) || 0),
            planamount: (mSubscription.subscription.plan_amount) / 100,
            mrr: (mSubscription.subscription.mrr) / 100,
            nextpaymentamount: (nextPaymentAmount) / 100,
            hasscheduledchanges: mSubscription.subscription.has_scheduled_changes,
            cftotalpremiumamount: mSubscription.subscription.cf_total_premium_amount,
            cfmtatotalpremiumamount: mSubscription.subscription.cf_mta_total_premium_amount,
            deleted: mSubscription.subscription.deleted
        }

        for (key in subscriptionObj) {
            if (subscriptionObj[key] == undefined | subscriptionObj[key] == 'Invalid Date') {
                subscriptionObj[key] = null
            }
        }

        mSubscriptionList.push(subscriptionObj)

    }

    return mRawSubscriptionRequest.next_offset

}

async function cancelPolicy(pPolicyNumber, pCancelReason, pCancelDate) {

    pSalesPersonUserName = 'CancellationMasterAgent'
    pSiteDomainName = 'agent.pouchinsurance.com'
    
    // Importing the corresponding requests file
    clientCredentials = clientsCredentials.getExternalCredentials(global.authenticatedUser, credentialsEnvironment)

    const clientRequests = require(clientCredentials.filePath)

    mCancelationBody = {
        "CancellationEffective_DATE": pCancelDate,
        "CancellationReasonPublic_CHOICE": 'Chargebee charge failed',
        "CancellationReasonAgent_CHOICE": 'NonPayment of Premium (only carrier)',
        "CancellationAdditionalDetail_TXT": pCancelReason,
        "CancellationAgentUserName_TXT": pSalesPersonUserName,
        "CancellationReason": 'Chargebee charge failed'
    }

    // Making the request to Instanda
    policyNumberToCancel = await clientRequests.getPolicyNumber(pPolicyNumber)

    if (policyNumberToCancel == undefined) {
        return {
            success: false,
            error: 'The policy could not be cancelled. The policy not found on Instanda.',
            policyNumber: pPolicyNumber
        }
    }

    mCancelationQuery = {
        siteDomainName: pSiteDomainName,
        policyNumber: policyNumberToCancel,
        salesPersonUserName: pSalesPersonUserName
    }

    response = await instandaRequests.makeCancelRequestToInstanda(mCancelationBody, mCancelationQuery)

    return response

}

async function handleError(e, databaseEventLogObject, pWebhookRequest) {
    databaseEventLogObject.errorDescription = e.stack
    pouchRequests.insertChargebeeLog(databaseEventLogObject)

    // Full detailed email (for us)
    emailString = `Unexpected error processing invoice!

    Full request:
    Webhook request:
    ${JSON.stringify(pWebhookRequest)}

    Subscription request:
    ${mSubscriptionStringified}

    Transaction request:
    ${mTransactionDataStringified}

    Error details:
    ${e.stack}`
    emails.sendCustomEmail(emailString, 'Chargebee Services - ' + environment + ' instance', emailList.detailedEmails, 'igarcia@teknedatalabs.com', 'Datateam error reporting')

    // Short email (for Hector)
    emailString = `An error has ocurred trying to cancel the following subscription:
    Subscription ID: ${pWebhookRequest.content.invoice.subscription_id}`

    //Uncomment to send email to Hector
    // emails.sendCustomEmail(emailString, 'Chargebee Services - ' + environment + ' instance', emailList.shortEmails, 'igarcia@teknedatalabs.com', 'Datateam error reporting')
}

async function obtainPolicyNumber(pInvoice, pSubscription, pPolicyRegex) {

    // Logic to obtain policyNumber
    // Invoice Description -> Subscription CF -> Customer CF


    let mInvoiceDescription = pInvoice.line_items[0].description

    let mPolicyNumber = ""

    // Trying to extract the policyNumber from the invoice description
    try {
        mPolicyNumber = pPolicyRegex.exec(mInvoiceDescription)[0]
    } catch {}
  

    // If the invoice description matches the policyPattern
    if (pPolicyRegex.test(mPolicyNumber)) {

        return mPolicyNumber

    } else {

        // If we dont have subscription as parameter, then we make the request
        if (pSubscription == undefined && pInvoice.subscription_id != undefined) {

            pSubscription = await chargebeeRequests.getSuscription(pInvoice.subscription_id)

        }

        // Checking if we have subscription info.
        if (pSubscription != null) {
            mPolicyNumber = pSubscription.subscription.cf_policy_number
        } else {
            mPolicyNumber = ''
        }
        
        
        // If the policyNumber from the subscription matches the policyPattern
        if (pPolicyRegex.test(mPolicyNumber)) {
           
            return mPolicyNumber
            
        } else {

            let mCustomer = await chargebeeRequests.getCustomer(pInvoice.customer_id)
            mPolicyNumber = mCustomer.customer.cf_policy_number

            // If the policyNumber from the customer matches the policyPattern 
            if (pPolicyRegex.test(mPolicyNumber)) {

                return mPolicyNumber

            } else {

                // If not, then we return null as we dont have other methods to get it.
                return null

            }

        }

    }

}



// Module exports
module.exports = {
    getAllInvoices,
    getAllSubscriptions,
    getAllTransactions,
    cancelPolicy
}