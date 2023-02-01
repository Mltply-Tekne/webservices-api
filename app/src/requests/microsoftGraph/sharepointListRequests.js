// HTTP requests Module
const httpRequests = require(`${process.env.srcPath}/helpers/httpRequests`)

// Microsoft Graph Authentication
const authRequests = require(`${process.env.srcPath}/requests/microsoftGraph/authRequests.js`)

// Credencials obtained from Auth file
const microsoftGraphCredentials = require(`${process.env.srcPath}/auth/microsoftGraphCredentials`)

// Imported to get cancellation data
const pouchRequests = require(`${process.env.srcPath}/requests/pouchRequests.js`)


// Add to a Sharepoint list
async function addToList(pSiteId, pListId, pQuoteRef) {

    // Get data from Instanda
    cancelData = await pouchRequests.getSharepointCancelInformation(pQuoteRef)

    // Docs ---> https://learn.microsoft.com/en-us/graph/api/listitem-create?view=graph-rest-1.0&tabs=http
    authHeader = await authRequests.getHeader()

    requestParameters = {
        json: {
            "fields": {
                "Title": cancelData.PouchPolicyNumber_TXT,
                "field_0": cancelData.CurrentDate, // Date of notice
                "field_10": cancelData.SalesPersonPhoneDisplay_TXT, // Agency Phone Num
                "field_11": cancelData.RemainingPremium, // Remaining Premium Due
                "field_12": cancelData.CancelledDate, // Cancellation Date
                "field_13": cancelData.finalnoticeamtdue, // Final Notice Amt Due
                "field_14": "RPA_Sys",
                "field_2": cancelData.PolicyEffective_DATE, // Policy Effective Date
                "field_3": cancelData.PolicyExpiration_DATE, // Policy Expiration Date
                "field_4": cancelData.ContactFullName_TXT, // Insured Full Name
                "field_5": cancelData.BusinessAddressLine1_TXT, // Insured Display Address 1
                "field_6": cancelData.BusinessAddressLine2_TXT, // Insured Display Address 2
                "field_7": cancelData.AgentGroupName, // Agency Display Name
                "field_8": cancelData.AgentGroupAddressDisplayLine1_TXT, // Agency Address Line 1
                "field_9": cancelData.AgentGroupAddressDisplayLine2_TXT, // Agency Address Line 2
                "INSUREDEMAIL": cancelData.External_AgentGroupEmail_Default,
                "agentemail": cancelData.External_AgentGroupEmail_Default,

            }
        },
        headers: authHeader
    }
    
    // addItemUrl = `https://graph.microsoft.com/v1.0/sites/${pSiteId}/lists/${pListId}/items/191`
    addItemUrl = `https://graph.microsoft.com/v1.0/sites/${pSiteId}/lists/${pListId}/items`

    // mResponse = await httpRequests.getRequest(addItemUrl, requestParameters)
    mResponse = await httpRequests.postRequest(addItemUrl, requestParameters)

    return mResponse

}

module.exports = {addToList}