const { body, validationResult } = require('express-validator');

function validateResponse(request, response, next) {

    response.verifyEmpty = function () {
        if (response.data.length == 0) {
            response.status(200)
            response.errors = 'No results were found.'
        }
        return response
    }

    response.verifyNull = function (pColumns) {

        err_status = 0

        for (pColumn of pColumns) {
            if (response.data[pColumn] == null) {
                err_status = 1
            }
        }

        if (err_status == 1) {
            response.status(200)
            response.error = 'No results were found.'
        }

        return response
    }

    response.send_json = function (pTitle, Multikey) {

        Response = new Object()
    
        if (response.error != undefined) {
            Response['success'] = false
            Response['error'] = response.error
        } else {
            Response['success'] = true
            // Response = Object.assign({success: true}, Response)  
        }

        if (Multikey == undefined) {
            if (pTitle == undefined) { pTitle = 'response' }
            Response[pTitle] = response.data
        } else {
            Response = Object.assign(Response, response.data)            
        }

        response.json(Response)
    }

    next()
}

function isObject (key) {
    if (key == '[object Object]') {
        return 'object'
    } else {
        return key
    }
}


module.exports = {validateResponse}