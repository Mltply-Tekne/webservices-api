const expressBasicAuth = require('express-basic-auth')

function getAuthenticatedUser(request, response, next) {

    global.authenticatedUser = request.auth.user
    
    next()
    
}

module.exports = {getAuthenticatedUser}