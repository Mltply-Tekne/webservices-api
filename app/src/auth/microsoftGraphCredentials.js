credentials = {
    pouch: {
        tenant: '839c791a-fa9f-46be-b92b-4749162f5501',
        client_id: '5eefd382-3bdb-41e1-ad2f-f52c6cd43308',
        client_secret: 'c.E8Q~hnsN-A1Z-CNrbLnXT_Iwp8X1_Jg6uCBa8o',
        config: {
            baseUrl: 'https://graph.microsoft.com/v1.0/',
            scopes: ['offline_access', 'https://graph.microsoft.com/Files.Read.All', 'https://graph.microsoft.com/Files.ReadWrite.All', 'https://graph.microsoft.com/Sites.Read.All', 'files.readwrite', 'User.Read', 'https://graph.microsoft.com/Sites.ReadWrite.All'],    
            redirect_uri: 'http://localhost:8080/'
        } 
    }
}

function getCredentials() {

    mUser = global.authenticatedUser
    mFoundCredentials = credentials[mUser]
    return mFoundCredentials

}

function getConfig() {
    mUser = global.authenticatedUser
    mFoundConfig = credentials[mUser].config
    return mFoundConfig
}

module.exports = {getCredentials, getConfig}