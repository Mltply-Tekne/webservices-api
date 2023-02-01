const { query, validationResult } = require('express-validator');
const basicAuth = require('express-basic-auth')

const {
  getTUVHS,
  getTUdriverMVR,
  // initializeClient
} = require(`${process.env.srcPath}/controllers/transunionController`)

// Obtaining TU credentials for basicAuth
var transunionCredentials = require(`${process.env.srcPath}/auth/transunionCredentials.js`)

router.post('/getVHS/',
  basicAuth(transunionCredentials.basicAuthCredentials),
  getTUVHS
)

router.post('/getDriverMVR/',
  basicAuth(transunionCredentials.basicAuthCredentials),
  getTUdriverMVR
)

router.post('/initializeClient/',
  basicAuth(transunionCredentials.basicAuthCredentials),
  initializeClient
)

let {getSwaggerConfig, swaggerUi} = require(`${process.env.srcPath}/config/swagger`)
router.use("/swagger", swaggerUi.serve, swaggerUi.setup(getSwaggerConfig('/docs/transunion/transunionSwagger.yaml')));

 
module.exports = router;