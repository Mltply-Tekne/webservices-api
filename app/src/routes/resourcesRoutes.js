const { check } = require('express-validator');

const { sendPathFile } = require(`${process.env.srcPath}/controllers/resourcesController`);
 
router.get('/*',
    sendPathFile
);

module.exports = router;