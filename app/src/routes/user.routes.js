// const { authJwt } = require("../middlewares");
// const controller = require("../controllers/user.controller");

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.get("/api/test/all", controller.allAccess);

//   app.get(
//     "/api/test/user",
//     [authJwt.verifyToken],
//     controller.userBoard
//   );

//   app.get(
//     "/api/test/mod",
//     [authJwt.verifyToken, authJwt.isModerator],
//     controller.moderatorBoard
//   );

//   app.get(
//     "/api/test/admin",
//     [authJwt.verifyToken, authJwt.isAdmin],
//     controller.adminBoard
//   );


// };



// V2
const { authJwt } = require('../middlewares');
const {
  allAccess,
  userBoard,
  moderatorBoard,
  adminBoard,
} = require('../controllers/user.controller');

const router = require('express').Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
});

router.get('/api/test/all', allAccess);

router.get('/api/test/user', [authJwt.verifyToken], userBoard);

router.get(
  '/api/test/mod',
  [authJwt.verifyToken, authJwt.isModerator],
  moderatorBoard
);

router.get(
  '/api/test/admin',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminBoard
);

module.exports = router;