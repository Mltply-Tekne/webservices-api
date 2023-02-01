const instandaCredentials = {
    test: {
        username: 'datateam_test',
        password: '12zDyT3!FPjX',
        baseUrl: 'https://api.instanda.us/Test/v0.1/Package11922'
    }
    ,
    production: {
        username: 'datateam_live',
        password: 'd$eAm%Q3Insb',
        baseUrl: 'https://api.instanda.us/Live/v0.1/Package11922'
    }
    
}

function getInstandaCredentials (pHardcodedEnvironment) {

    var environment = ""

    if (pHardcodedEnvironment != undefined) {

        environment = pHardcodedEnvironment

    } else {
        
        environment = process.env.credentialsEnvironment

    }
    
    crendential = instandaCredentials[environment]
    return crendential

}

module.exports = {
    getInstandaCredentials
}