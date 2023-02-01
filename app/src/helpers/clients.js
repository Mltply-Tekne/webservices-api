
const { clients } = require(`${process.env.srcPath}/auth/clientsCredentials`)


function verifyClient (pClient, pToken) {

    try {
        token = clients[pClient].redirectServices.token
        
        if (token == pToken) {
            return true
        } else {
            return false
        }

    } catch (e) {
        return false
    }
    
}

module.exports = {verifyClient}