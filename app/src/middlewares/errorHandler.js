const emails = require(`${process.env.srcPath}/config/emails`)

function handleError(error, request, response, next) {
    
    if (error.type == 'entity.parse.failed') {

        response.status(400).json({
          success: 'false',
          error: {
            msg: 'JSON parsing failed',
            location: 'body'
          }
        })

    } else {
        console.log('An error has ocurred! Sending error email.')
        emails.sendErrorEmail(error.stack)
        console.log(error.stack)
        response.status(500)
        response.send()
    }

}

module.exports = {handleError}