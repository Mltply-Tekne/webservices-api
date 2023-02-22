const { check } = require('express-validator');

const { renderPoliciesCancellations } = require(`${process.env.srcPath}/controllers/cancellationsController`);
 
router.get('/',
    renderPoliciesCancellations
);

module.exports = router;