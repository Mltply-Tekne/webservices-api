const { query, validationResult } = require('express-validator');
const {getAuthenticatedUser} = require(`${process.env.srcPath}/middlewares/getAuthenticatedUser`)
const basicAuth = require('express-basic-auth')

const {
  getAllInvoices,
  getAllSubscriptions,
  getAllTransactions,
  cancelPolicy
} = require(`${process.env.srcPath}/controllers/chargebeeController`)


// Obtaining Chargebee credentials for basicAuth
var chargebeeCredentials = require(`${process.env.srcPath}/auth/chargebeeCredentials.js`)

router.get('/getAllInvoices/:updatedAfterTimestamp',
  basicAuth(chargebeeCredentials.basicAuthCredentials),
  getAuthenticatedUser,
  getAllInvoices
)

router.get('/getAllSubscriptions/:updatedAfterTimestamp',
  basicAuth(chargebeeCredentials.basicAuthCredentials),
  getAuthenticatedUser,
  getAllSubscriptions
)

router.get('/getAllTransactions/:updatedAfterTimestamp',
  basicAuth(chargebeeCredentials.basicAuthCredentials),
  getAuthenticatedUser,
  getAllTransactions
)

router.post('/cancelPolicy/',
  basicAuth(chargebeeCredentials.basicAuthCredentials),
  getAuthenticatedUser,
  cancelPolicy
)

let {getSwaggerConfig, swaggerUi} = require(`${process.env.srcPath}/config/swagger`)
router.use("/swagger", swaggerUi.serve, swaggerUi.setup(getSwaggerConfig('/docs/transunion/transunionSwagger.yaml')));

 
module.exports = router;