
const YAML = require('yamljs');
const swaggerUi = require("swagger-ui-express");

  
function getSwaggerConfig(Path) {


    const swaggerDocument = YAML.load(`${process.env.srcPath}${Path}`);

    // Setting the API environment in the Swagger config.
    try {
        mainServerURL = swaggerDocument.servers[0].url
        mainServerURL = mainServerURL.replace('$apiEnvironment', process.env.environment)
        swaggerDocument.servers[0].url = mainServerURL
    } catch {
        console.log("Swagger Error: We couldn't automatically set the server URL.")
    }
    

    return swaggerDocument
    

   
}


module.exports = {getSwaggerConfig, swaggerUi}