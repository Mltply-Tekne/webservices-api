const { query, validationResult } = require('express-validator');

const {
  generateReport,
  generatePouchReport,
  generateSalesReport,
  generateAboutToExpireReport,
  generateNextDueDateReport,
  downloadDataset,
  downloadPolicyPdf
} = require(`${process.env.srcPath}/controllers/datasetDownloadController`)

router.get('/downloadDataset/:datasetName',
  query('client').isString().isLength({min:1}).withMessage("client is required"),
  query('token').isString().isLength({min:1}).withMessage("token is required"),
  downloadDataset
)

router.get('/downloadPolicyPdf/CommercialAutoPolicy',
  query('client').isString().isLength({min:1}).withMessage("client is required"),
  query('token').isString().isLength({min:1}).withMessage("token is required"),
  query('quoteRef').isString().isLength({min:1}).withMessage("quoteRef is required"),
  query('businessState').isString().isLength({min:2}).withMessage("businessState is required"),
  downloadPolicyPdf
)


router.get('/generatePouchReport/',
generatePouchReport
)

router.get('/generateReport/',
generateReport
)

router.get('/generateSalesReport/',
query('client').isString().isLength({min:1}).withMessage("client is required"),
query('token').isString().isLength({min:1}).withMessage("token is required"),
generateSalesReport)

router.get('/generateAboutToExpireReport/',
query('client').isString().isLength({min:1}).withMessage("client is required"),
query('token').isString().isLength({min:1}).withMessage("token is required"),
generateAboutToExpireReport)

router.get('/generateNextDueDateReport',
generateNextDueDateReport
)
 
module.exports = router;