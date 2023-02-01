// HTTP requests module
const httpRequests = require(`${process.env.srcPath}/helpers/httpRequests`)

// Credencials obtained from Auth file
const microsoftGraphCredentials = require(`${process.env.srcPath}/auth/microsoftGraphCredentials`)


// Make a post to Graph to get an access token
async function getAccessToken() {

    mCredentials = microsoftGraphCredentials.getCredentials()

    let url = `https://login.microsoftonline.com/${mCredentials.tenant}/oauth2/v2.0/token`

    let postRequestParameters = {
        form: {
            "client_id": mCredentials.client_id,
            "scope": 'https://graph.microsoft.com/.default',
            "client_secret": mCredentials.client_secret,
            "grant_type": 'client_credentials'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    mResponse = await httpRequests.postRequest(url, postRequestParameters)
    mToken = await mResponse.parsed.access_token

    return mToken

}

// Format the header using the accessToken
async function getHeader() {

    mToken = await getAccessToken()
    
    mHeader = {
        'Authorization': 'Bearer ' + mToken,
        'Prefer': 'bypass-shared-lock'
    }

    return mHeader

}

module.exports = {getHeader}