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
  var sessionHandler = function() {
    return models.Sessions.create()
      .then((results) => {
        return models.Sessions.get({'id': results.insertId});
      })
      .then((results) => {
        if (req['session'] === undefined) {
          req['session'] = {};
        }
        req['session']['hash'] = results.hash;
        res.cookie('shortlyid', results.hash);
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (req.cookies === undefined || Object.keys(req.cookies).length === 0) {
    return sessionHandler();
  }

  if (Object.keys(req.cookies).length !== 0) {
    return models.Sessions.get({'hash': req.cookies.shortlyid})
      .then((results) => {
        if (results === undefined || results.userId === null) {
          return sessionHandler();
        }
        if (results.userId !== null && results !== undefined) {
          if (req['session'] === undefined) {
            req['session'] = {};
          }
          req['session']['hash'] = results.hash;
          req['session']['userId'] = results.userId;
          res.cookie('shortlyid', results.hash);
          return models.Users.get({'id': results.userId})
            .then((results) => {
              req._setSessionVariable('user', {'username': results.username});
              req['session']['user'] = {'username': results.username};
              next();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  }











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

