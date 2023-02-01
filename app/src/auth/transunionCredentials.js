masterCredentials = {
    pouch_test: {
        vhs: {
            industryCode: 'I',
            memberCode: '9006891',
            inquirySubscriberPrefixCode: '0622',
            password: 'HF3Z',
            vendorUserID: 'D86929057',
            httpsKey: `${process.env.srcPath}/certs/transunion/pouch/key.pem`,
            httpsCert: `${process.env.srcPath}/certs/transunion/pouch/cert.pem`,
            url: 'https://netaccess-test.transunion.com/'
        },
        mvr: {
            industryCode: 'I',
            memberCode: '9006889',
            inquirySubscriberPrefixCode: '0622',
            password: 'GZ42',
            vendorUserID: '45D37183-9D81-4FA7-B048-88553405A905',
            httpsKey: `${process.env.srcPath}/certs/transunion/pouch/key.pem`,
            httpsCert: `${process.env.srcPath}/certs/transunion/pouch/cert.pem`,
            url: 'https://netaccess-test.transunion.com/'
        }
    },
    stable_test: {
        vhs: {
            industryCode: 'I',
            memberCode: '9006891',
            inquirySubscriberPrefixCode: '0622',
            password: 'HF3Z',
            vendorUserID: 'D86929057',
            httpsKey: `${process.env.srcPath}/certs/transunion/pouch/key.pem`,
            httpsCert: `${process.env.srcPath}/certs/transunion/pouch/cert.pem`,
            url: 'https://netaccess-test.transunion.com/'
        },
        mvr: {
            industryCode: 'I',
            memberCode: '9006889',
            inquirySubscriberPrefixCode: '0622',
            password: 'GZ42',
            vendorUserID: '51A59050-6374-4AED-A78E-1A4BDD8FDE6A',
            httpsKey: `${process.env.srcPath}/certs/transunion/pouch/key.pem`,
            httpsCert: `${process.env.srcPath}/certs/transunion/pouch/cert.pem`,
            url: 'https://netaccess-test.transunion.com/'
        }  
    }
}

basicAuthCredentials = {
    users: {
        "pouch": "1FC8F58304",
        "stable": "97334ED806"
    }
}

function obtainVHSCredentials(clientName) {
    return masterCredentials[clientName]['vhs']
}

function obtainMVRCredentials(clientName) {
    return masterCredentials[clientName]['mvr']
}

module.exports = {obtainVHSCredentials, obtainMVRCredentials, basicAuthCredentials}