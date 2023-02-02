const { check } = require('express-validator');

const { renderAgencyVerification } = require(`${process.env.srcPath}/controllers/agencyVerificationController`);
 
router.get('/:mode',
    renderAgencyVerification
);

module.exports = router;