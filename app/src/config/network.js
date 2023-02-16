const cors = require('cors')
var https = require('https')
var httpsRedirect = require('express-https-redirect');
const fs = require('fs')
// const promBundle = require("express-prom-bundle");
const basicAuth = require('express-basic-auth')


var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Middlewares
var responseValidationMiddleware = require(`${process.env.srcPath}/middlewares/responseValidation`)
var requestValidationMiddleware = require(`${process.env.srcPath}/middlewares/requestValidation`)
var errorHandlerMiddleware = require(`${process.env.srcPath}/middlewares/errorHandler`)

// Prometheus

// App
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const register = new client.Registry()
// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

const counter = new client.Counter({
  name: 'node_request_operations_total',
  help: 'The total number of processed requests'
});

const histogram = new client.Histogram({
  name: 'node_request_duration_seconds',
  help: 'Histogram for the duration in seconds.',
  buckets: [1, 2, 5, 6, 10]
});

const httpRequestTimer = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'handler', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// register.registerMetric(counter)
register.registerMetric(histogram)
register.registerMetric(httpRequestTimer)


module.exports = function( app, express ) {
  var config = this;

  const profilerMiddleware = (request, response, next) => {
    const end = httpRequestTimer.startTimer()

    response.once('finish', () => {
      const duration = end({handler: request.url, method: request.method, status_code: response.statusCode });
      // logger.info('Duration  %d', duration);
    });
    next()
  }
  
  app.use(profilerMiddleware);

  var dateHelper = require(`${process.env.srcPath}/helpers/dates.js`)

  // HTTP
  app.listen(process.env.httpPort, () => {
      console.log(`${dateHelper.getTimeStamp()} - Server Running`);
  });

  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    
    metrics = await register.metrics()
    res.set('Content-Type', client.register.contentType)
    res.end(metrics)
    
  })

  // app.use(metricsMiddleware)

  console.log(`${dateHelper.getTimeStamp()} - HTTP server running on port ${process.env.httpPort}`);

  if (process.env.useHttps == 'True') {

    var privateKey = fs.readFileSync(process.env.httpsPrivateKey);
    var certificate = fs.readFileSync(process.env.httpsCert);

    // HTTPS
    https.createServer({
      key: privateKey,
      cert: certificate
    }, app).listen(process.env.httpsPort);

    app.use(httpsRedirect())

    console.log(`${dateHelper.getTimeStamp()} - HTTPS server running on port ${process.env.httpsPort}`);

  } else if (process.env.useHttps == 'False') {
    console.log('Warning: HTTPS is disabled!')
  } else {
    errorHandler.throwException('"useHttps" setting must be True or False')
  }

  // Auth
  // app.use(basicAuth({
  //   users: JSON.parse(process.env.users)
  // }))

  
  // Cors Settings
  app.use(cors({
    origin: process.env.corsOrigins
  }));
  
  app.use(urlencodedParser)
  app.use(bodyParser.json({ type: 'application/json' }))

  app.use(requestValidationMiddleware.validateRequest)
  app.use(responseValidationMiddleware.validateResponse)
  
  setTimeout(function(){
    app.use(errorHandlerMiddleware.handleError)
  }, 2000);
  


  return config;
};

