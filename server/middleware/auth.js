const models = require('../models');
const Promise = require('bluebird');


//Spec Runner Tests for Sessions
//initializes a new session when there are no cookies on the request
//sets a new cookie on the response when a session is initialized
//assigns a session object to the request if a session already exists
//creates a new hash for each new session
//assigns a username and userId property to the session object if the session is assigned to a user
//clears and reassigns a new cookie if there is no session assigned to the cookie

module.exports.createSession = (req, res, next) => {
  console.log('Create Session Req: ', req);
  //if req.cookies is not empty

  //  check if that cookie is associated with a person then
  //    get session id then
  //    req._setSessionVariable to results (or can do typical object value assignment) req[session] = results
  //    res.cookie('name for the cookie (shortlyid)', 'what is the cookie')

  //  if cookie is not associated with a person
  //    create session then
  //    get session id then
  //    req._setSessionVariable to results (or can do typical object value assignment) req[session] = results
  //    res.cookie('name for the cookie (shortlyid)', 'what is the cookie')

  //if req.cookies is empty
  //    create session then
  //    get session id then
  //    req._setSessionVariable to results (or can do typical object value assignment) req[session] = results
  //    res.cookie('name for the cookie (shortlyid)', 'what is the cookie')










  // Commenting Out for Now!
  // if (req.cookies === {}) {
  //   throw newSession;
  // } else {
  //   for (var key in req.cookies) {
  //     return models.Sessions.get({'hash': req.cookies[key]})
  //       .then()
  //   }
  // }
  // return (models.Sessions.create({ 'hash': null, 'userId': null }))
  //   .then(results => {
  //     return utils.createRandom32String();
  //   })
  //   .then(hash => {
  //     return models.Sessions.update({ 'hash': hash, 'userId': null });
  //   })
  //   .then(results => {
  //     res.status(201).send(results.hash);
  //     next();
  //   })
  //   .error(error => {
  //     res.status(500).send(error);
  //     next();
  //   });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

