// const { verifySignUp } = require("../middlewares");
// const controller = require("../controllers/auth.controller");

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.post(
//     "/api/auth/signup",
//     [
//       verifySignUp.checkDuplicateUsernameOrEmail,
//       verifySignUp.checkRolesExisted
//     ],
//     controller.signup
//   );

//   app.post("/api/auth/signin", controller.signin);

//   app.post("/api/auth/signout", controller.signout);
// };


// V2
const { check } = require('express-validator');
const { signup, signupPage, signin, signInPage, signout } = require('../controllers/auth.controller');
const { verifySignUp } = require('../middlewares');

const router = require('express').Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
});

router.get('/signup', signupPage);
router.post(
  '/api/auth/signup',
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  signup
);

router.get('/signin', signInPage);
router.post('/api/auth/signin', signin);

router.post('/api/auth/signout', signout);

module.exports = router;
