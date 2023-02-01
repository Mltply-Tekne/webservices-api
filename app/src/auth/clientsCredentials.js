clients = {
    pouch: {
        redirectServices: {
            token: "8jNMtA36iC7Z"
        },
        externalRequests: {
            filePath: `${process.env.srcPath}/requests/pouchRequests.js`,
            production: {
                baseUrl: "https://pouch.eastus.cloudapp.azure.com/api",
                token: "lwo09tpDykEXLs1aL2UeYgKfC3Tmz4P3s4oEndo9" 
            },
            test: {
                baseUrl: "https://pouch.eastus.cloudapp.azure.com/dev/api",
                token: "lwo09tpDykEXLs1aL2UeYgKfC3Tmz4P3s4oEndo9" 
            },
        },
        chargebee: {
            production:{
                baseUrl: "https://pouch.chargebee.com/api/v2",
                apikey: "live_KyTrO7wnkZepcdcfGrPzA0s5BKWJOcdoHD",
                emailList: {
                    shortEmails: ['igarcia@teknedatalabs.com'],
                    detailedEmails: ['igarcia@teknedatalabs.com']
                }
            },
            test:{
                baseUrl: "https://pouch.chargebee.com/api/v2",
                apikey: "live_KyTrO7wnkZepcdcfGrPzA0s5BKWJOcdoHD",
                emailList: {
                    shortEmails: ['igarcia@teknedatalabs.com'],
                    detailedEmails: ['igarcia@teknedatalabs.com']
                }
            }
            
            // test:{
            //     baseUrl: "https://pouch-test.chargebee.com/api/v2",
            //     apikey: "test_ReZHFcd5kpCvcdm7gcucdYWf6NIsJRiuPJTN",
            //     emailList: {
            //         shortEmails: ['igarcia@teknedatalabs.com'],
            //         detailedEmails: ['igarcia@teknedatalabs.com']
            //     }
            // } 
        },
    },
    stable: {
        redirectServices: {
            token: "HgW98LWfKBm5"
        },
        pathRequests: ""
    }
}

function getExternalCredentials (pClient, pEnvironment) {

    client = clients[pClient]

    externalCredentials = client.externalRequests

    clientCredentials = externalCredentials[pEnvironment]

    clientCredentials.filePath = externalCredentials.filePath

    return clientCredentials

}


module.exports = {clients, getExternalCredentials}
