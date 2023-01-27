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
  console.log('REQ: ', req);
  //relevant user information: userId, isLoggedIn,
  return models.Sessions.getAll({'hash': hash})
    .then(results => {
      if (req.cookies === {} || results === undefined) {
        throw newSession;
      } else {
        for (var key in req.cookies) {
          if (results[req.cookies[key]] === undefined) {
            throw newSession;
          }
        }
      }
      // return ????? *** STOPPED HERE THURSDAY ***
    });

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

